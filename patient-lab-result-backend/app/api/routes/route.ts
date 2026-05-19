import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const apiDir = path.join(process.cwd(), 'app/api');
  const routes: string[] = [];
  
  function walkDir(dir: string, basePath: string = '') {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walkDir(fullPath, path.join(basePath, file));
      } else if (file === 'route.ts' || file === 'route.js') {
        routes.push(`/api${basePath}`);
      }
    }
  }
  
  walkDir(apiDir);
  return NextResponse.json({ 
    message: 'Available API endpoints',
    endpoints: routes 
  });
}