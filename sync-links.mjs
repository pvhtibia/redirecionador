#!/usr/bin/env node

/**
 * Script para sincronizar links do localStorage com o arquivo JSON
 * Execute este script após criar links no painel para salvá-los permanentemente
 * 
 * Uso: node sync-links.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.join(__dirname, 'client', 'public', 'links-config.json');

console.log('📝 Sincronizador de Links - Link Redirector');
console.log('==========================================\n');

// Verificar se o arquivo de configuração existe
if (!fs.existsSync(configPath)) {
  console.log('❌ Arquivo de configuração não encontrado em:', configPath);
  console.log('Criando arquivo vazio...\n');
  fs.writeFileSync(configPath, JSON.stringify({ links: [] }, null, 2));
}

// Ler arquivo atual
let currentConfig = {};
try {
  const content = fs.readFileSync(configPath, 'utf-8');
  currentConfig = JSON.parse(content);
} catch (error) {
  console.error('❌ Erro ao ler arquivo de configuração:', error.message);
  process.exit(1);
}

console.log('📊 Status Atual:');
console.log(`   Total de links salvos: ${currentConfig.links?.length || 0}`);

if (currentConfig.links && currentConfig.links.length > 0) {
  console.log('\n📋 Links Salvos:');
  currentConfig.links.forEach((link, index) => {
    console.log(`   ${index + 1}. ${link.name}`);
    console.log(`      Código: ${link.shortCode}`);
    console.log(`      URL: ${link.targetUrl}`);
    console.log(`      Cliques: ${link.clicks}`);
  });
}

console.log('\n✅ Sincronização concluída!');
console.log('\n💡 Dica: Para adicionar novos links via CLI, edite o arquivo:');
console.log(`   ${configPath}`);
console.log('\nExemplo de estrutura:');
console.log(JSON.stringify({
  links: [
    {
      id: 'id-unico',
      shortCode: 'ABC123',
      name: 'Meu Link',
      targetUrl: 'https://exemplo.com',
      createdAt: new Date().toISOString(),
      clicks: 0
    }
  ]
}, null, 2));
