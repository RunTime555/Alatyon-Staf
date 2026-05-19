import { query } from './db';

export interface ParameterStatus {
  status: 'high' | 'low' | 'normal';
  explanation: string;
}

export async function getParameterExplanation(
  parameterName: string,
  resultValue: number,
  normalMin: number,
  normalMax: number
): Promise<ParameterStatus> {
  // Determine status
  let status: 'high' | 'low' | 'normal';
  if (resultValue > normalMax) {
    status = 'high';
  } else if (resultValue < normalMin) {
    status = 'low';
  } else {
    status = 'normal';
  }
  
  // Try to get template from database
  const result = await query(
    `SELECT template_text FROM explanation_templates 
     WHERE parameter_name = $1 AND condition_type = $2 
     LIMIT 1`,
    [parameterName, status]
  );
  
  let explanation: string;
  
  if (result.rows.length > 0) {
    explanation = result.rows[0].template_text;
  } else {
    // Default explanations
    if (status === 'high') {
      explanation = `Your ${parameterName} level is higher than normal. Please consult your doctor.`;
    } else if (status === 'low') {
      explanation = `Your ${parameterName} level is lower than normal. Please consult your doctor.`;
    } else {
      explanation = `Your ${parameterName} level is within normal range.`;
    }
  }
  
  return { status, explanation };
}

export async function autoGenerateExplanations(labTestId: string): Promise<void> {
  // Get all results for this test
  const results = await query(
    `SELECT * FROM lab_results WHERE lab_test_id = $1`,
    [labTestId]
  );
  
  // Generate explanations for each result
  for (const result of results.rows) {
    const { explanation } = await getParameterExplanation(
      result.parameter_name,
      result.result_value,
      result.normal_min,
      result.normal_max
    );
    
    // Update the result with the explanation
    await query(
      `UPDATE lab_results SET simple_explanation = $1 WHERE id = $2`,
      [explanation, result.id]
    );
  }
}