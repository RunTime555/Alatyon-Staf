import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const templates = [
    {
      id: '1',
      parameter_name: 'WBC',
      condition_type: 'high',
      template_text: 'Your white blood cells are higher than normal. This may indicate infection.'
    },
    {
      id: '2',
      parameter_name: 'WBC',
      condition_type: 'low',
      template_text: 'Your white blood cells are lower than normal. This may increase infection risk.'
    },
    {
      id: '3',
      parameter_name: 'Hemoglobin',
      condition_type: 'high',
      template_text: 'Your hemoglobin is high. This may indicate dehydration.'
    },
    {
      id: '4',
      parameter_name: 'Hemoglobin',
      condition_type: 'low',
      template_text: 'Your hemoglobin is low. This may indicate anemia.'
    }
  ];
  
  return NextResponse.json({
    success: true,
    data: templates
  });
}