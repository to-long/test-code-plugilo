/**
 * Generate static Swagger files
 * Run: pnpm generate:swagger
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { openApiSpec, generateSwaggerHtml } from './spec.js';

const OUTPUT_DIR = './public';

function generate() {
  // Create output directory
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Generate swagger.json
  const jsonPath = `${OUTPUT_DIR}/swagger.json`;
  writeFileSync(jsonPath, JSON.stringify(openApiSpec, null, 2));
  console.log(`✅ Generated: ${jsonPath}`);

  // Generate swagger.html
  const htmlPath = `${OUTPUT_DIR}/swagger.html`;
  writeFileSync(htmlPath, generateSwaggerHtml('./swagger.json'));
  console.log(`✅ Generated: ${htmlPath}`);

  console.log('\n📁 Static files ready in ./public/');
}

generate();
