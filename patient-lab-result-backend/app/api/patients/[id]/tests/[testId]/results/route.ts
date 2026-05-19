import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { getParameterExplanation } from '@/lib/explanations';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; testId: string } }
) {
  try {
    // Check authentication
    const { error, user } = await requireAuth(request, ['patient', 'doctor', 'lab_technician']);
    if (error) return error;
    
    // Verify patient owns this test
    const testResult = await query(
      `SELECT * FROM lab_tests WHERE id = $1 AND patient_id = $2`,
      [params.testId, params.id]
    );
    
    if (testResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }
    
    const test = testResult.rows[0];
    
    // Get all results for this test
    const results = await query(
      `SELECT * FROM lab_results WHERE lab_test_id = $1`,
      [params.testId]
    );
    
    // Enhance results with status and explanations
    const enhancedResults = await Promise.all(
      results.rows.map(async (result) => {
        // If no explanation exists, generate one
        if (!result.simple_explanation) {
          const { status, explanation } = await getParameterExplanation(
            result.parameter_name,
            result.result_value,
            result.normal_min,
            result.normal_max
          );
          
          return {
            ...result,
            status,
            simple_explanation: explanation
          };
        }
        
        // Determine status from values
        let status: string;
        if (result.result_value > result.normal_max) {
          status = 'high';
        } else if (result.result_value < result.normal_min) {
          status = 'low';
        } else {
          status = 'normal';
        }
        
        return {
          ...result,
          status
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      data: {
        test_info: test,
        results: enhancedResults
      }
    });
    
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}