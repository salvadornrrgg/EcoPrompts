# test-api.ps1
# Script para testar os endpoints da API EcoPrompts conforme documentação

$BASE_URL = "http://localhost:3000/api"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testes da API EcoPrompts" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# ============================================
# 1. TESTES DE CATEGORIAS
# ============================================
Write-Host "`n[1] TESTES DE CATEGORIAS" -ForegroundColor Yellow

# 1.1 POST /categories - Criar categoria
Write-Host "`n[1.1] POST /categories - Criar categoria" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$BASE_URL/categories" -Method Post -ContentType "application/json" -Body '{"name":"Programacao"}'
$response | ConvertTo-Json -Depth 10

# 1.2 POST /categories - Criar outra categoria
Write-Host "`n[1.2] POST /categories - Criar categoria Inteligencia Artificial" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$BASE_URL/categories" -Method Post -ContentType "application/json" -Body '{"name":"Inteligencia Artificial"}'
$response | ConvertTo-Json -Depth 10

# 1.3 POST /categories - Erro: categoria sem nome (validação)
Write-Host "`n[1.3] POST /categories - Erro: categoria sem nome" -ForegroundColor Red
try {
    Invoke-RestMethod -Uri "$BASE_URL/categories" -Method Post -ContentType "application/json" -Body '{"name":""}'
} catch {
    Write-Host "Erro (esperado): $($_.Exception.Message)" -ForegroundColor Red
}

# 1.4 GET /categories - Listar todas as categorias
Write-Host "`n[1.4] GET /categories - Listar categorias" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$BASE_URL/categories" -Method Get
$response | ConvertTo-Json -Depth 10

# 1.5 GET /categories/{categoryId}/prompts - Listar prompts de uma categoria
Write-Host "`n[1.5] GET /categories/1/prompts - Listar prompts da categoria ID=1" -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/categories/1/prompts" -Method Get
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Ainda sem prompts (normal)" -ForegroundColor Yellow
}

# ============================================
# 2. TESTES DE UTILIZADORES
# ============================================
Write-Host "`n[2] TESTES DE UTILIZADORES" -ForegroundColor Yellow

# 2.1 POST /users - Criar utilizador
Write-Host "`n[2.1] POST /users - Criar utilizador" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$BASE_URL/users" -Method Post -ContentType "application/json" -Body '{"username":"joaosilva","email":"joao@email.com","password":"123456","userType":0}'
$response | ConvertTo-Json -Depth 10

# 2.2 POST /users - Criar utilizador admin
Write-Host "`n[2.2] POST /users - Criar utilizador admin" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$BASE_URL/users" -Method Post -ContentType "application/json" -Body '{"username":"admin","email":"admin@email.com","password":"admin123","userType":2}'
$response | ConvertTo-Json -Depth 10

# 2.3 POST /users - Erro: email inválido
Write-Host "`n[2.3] POST /users - Erro: email invalido" -ForegroundColor Red
try {
    Invoke-RestMethod -Uri "$BASE_URL/users" -Method Post -ContentType "application/json" -Body '{"username":"teste","email":"emailerrado","password":"123456","userType":0}'
} catch {
    Write-Host "Erro (esperado): $($_.Exception.Message)" -ForegroundColor Red
}

# 2.4 GET /users - Listar todos os utilizadores
Write-Host "`n[2.4] GET /users - Listar utilizadores" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$BASE_URL/users" -Method Get
$response | ConvertTo-Json -Depth 10

# 2.5 GET /users/{userId} - Buscar utilizador específico
Write-Host "`n[2.5] GET /users/1 - Buscar utilizador ID=1" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$BASE_URL/users/1" -Method Get
$response | ConvertTo-Json -Depth 10

# 2.6 PUT /users/{userId} - Atualizar utilizador
Write-Host "`n[2.6] PUT /users/1 - Atualizar utilizador" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$BASE_URL/users/1" -Method Put -ContentType "application/json" -Body '{"username":"joaosilva_atualizado"}'
$response | ConvertTo-Json -Depth 10

# 2.7 DELETE /users/{userId} - Remover utilizador
Write-Host "`n[2.7] DELETE /users/2 - Remover utilizador ID=2" -ForegroundColor Green
try {
    Invoke-RestMethod -Uri "$BASE_URL/users/2" -Method Delete
    Write-Host "Utilizador removido com sucesso" -ForegroundColor Green
} catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# ============================================
# 3. TESTES DE PROMPTS
# ============================================
Write-Host "`n[3] TESTES DE PROMPTS" -ForegroundColor Yellow

# 3.1 POST /prompts - Criar prompt
Write-Host "`n[3.1] POST /prompts - Criar prompt" -ForegroundColor Green
$promptBody = '{
    "title": "Escreve codigo Python",
    "description": "Prompt para gerar codigo Python que calcula media",
    "prompt": "Escreve uma funcao em Python que calcula a media de uma lista de numeros",
    "AImodel": "ChatGPT",
    "result": "def media(lista): return sum(lista)/len(lista)",
    "categoryId": 1,
    "userId": 1
}'
$response = Invoke-RestMethod -Uri "$BASE_URL/prompts" -Method Post -ContentType "application/json" -Body $promptBody
$response | ConvertTo-Json -Depth 10

# 3.2 POST /prompts - Criar outro prompt
Write-Host "`n[3.2] POST /prompts - Criar prompt JavaScript" -ForegroundColor Green
$promptBody2 = '{
    "title": "Explica JavaScript",
    "description": "Prompt para explicar conceitos de JavaScript",
    "prompt": "Explica o que e closure em JavaScript",
    "AImodel": "Gemini",
    "result": "Closure e uma funcao que tem acesso ao escopo da funcao pai",
    "categoryId": 1,
    "userId": 1
}'
$response = Invoke-RestMethod -Uri "$BASE_URL/prompts" -Method Post -ContentType "application/json" -Body $promptBody2
$response | ConvertTo-Json -Depth 10

# 3.3 POST /prompts - Erro: sem título (validação)
Write-Host "`n[3.3] POST /prompts - Erro: sem titulo" -ForegroundColor Red
try {
    $badBody = '{"description":"teste","prompt":"teste","AImodel":"ChatGPT","result":"teste","categoryId":1,"userId":1}'
    Invoke-RestMethod -Uri "$BASE_URL/prompts" -Method Post -ContentType "application/json" -Body $badBody
} catch {
    Write-Host "Erro (esperado): $($_.Exception.Message)" -ForegroundColor Red
}

# 3.4 GET /prompts - Listar todos os prompts
Write-Host "`n[3.4] GET /prompts - Listar prompts" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$BASE_URL/prompts" -Method Get
$response | ConvertTo-Json -Depth 10

# 3.5 GET /prompts/{promptId} - Buscar prompt específico
Write-Host "`n[3.5] GET /prompts/1 - Buscar prompt ID=1" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$BASE_URL/prompts/1" -Method Get
$response | ConvertTo-Json -Depth 10

# 3.6 PUT /prompts/{promptId} - Editar prompt
Write-Host "`n[3.6] PUT /prompts/1 - Atualizar prompt" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$BASE_URL/prompts/1" -Method Put -ContentType "application/json" -Body '{"title":"Escreve codigo Python AVANCADO"}'
$response | ConvertTo-Json -Depth 10

# 3.7 DELETE /prompts/{promptId} - Remover prompt
Write-Host "`n[3.7] DELETE /prompts/2 - Remover prompt ID=2" -ForegroundColor Green
try {
    Invoke-RestMethod -Uri "$BASE_URL/prompts/2" -Method Delete
    Write-Host "Prompt removido com sucesso" -ForegroundColor Green
} catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# ============================================
# 4. TESTES DE VERSÕES
# ============================================
Write-Host "`n[4] TESTES DE VERSOES" -ForegroundColor Yellow

# 4.1 POST /prompts/{promptId}/versions - Criar versão
Write-Host "`n[4.1] POST /prompts/1/versions - Criar versao" -ForegroundColor Green
$versionBody = '{
    "promptText": "Escreve uma funcao em Python que calcula a media e o desvio padrao",
    "improvements": "Adicionado calculo do desvio padrao"
}'
$response = Invoke-RestMethod -Uri "$BASE_URL/prompts/1/versions" -Method Post -ContentType "application/json" -Body $versionBody
$response | ConvertTo-Json -Depth 10

# 4.2 POST /prompts/{promptId}/versions - Criar outra versão
Write-Host "`n[4.2] POST /prompts/1/versions - Criar versao 2" -ForegroundColor Green
$versionBody2 = '{
    "promptText": "Escreve uma funcao em Python que calcula media, mediana e desvio padrao",
    "improvements": "Adicionado mediana"
}'
$response = Invoke-RestMethod -Uri "$BASE_URL/prompts/1/versions" -Method Post -ContentType "application/json" -Body $versionBody2
$response | ConvertTo-Json -Depth 10

# 4.3 GET /prompts/{promptId}/versions - Listar versões
Write-Host "`n[4.3] GET /prompts/1/versions - Listar versoes" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$BASE_URL/prompts/1/versions" -Method Get
$response | ConvertTo-Json -Depth 10

# 4.4 GET /versions/{versionId} - Buscar versão específica
Write-Host "`n[4.4] GET /versions/1 - Buscar versao ID=1" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$BASE_URL/versions/1" -Method Get
$response | ConvertTo-Json -Depth 10

# 4.5 GET /versions/{versionId} - Erro: ID inválido
Write-Host "`n[4.5] GET /versions/abc - Erro: ID invalido" -ForegroundColor Red
try {
    Invoke-RestMethod -Uri "$BASE_URL/versions/abc" -Method Get
} catch {
    Write-Host "Erro (esperado): $($_.Exception.Message)" -ForegroundColor Red
}

# 4.6 DELETE /versions/{versionId} - Remover versão
Write-Host "`n[4.6] DELETE /versions/2 - Remover versao ID=2" -ForegroundColor Green
try {
    Invoke-RestMethod -Uri "$BASE_URL/versions/2" -Method Delete
    Write-Host "Versao removida com sucesso" -ForegroundColor Green
} catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# ============================================
# 5. VERIFICAÇÃO FINAL
# ============================================
Write-Host "`n[5] VERIFICACAO FINAL" -ForegroundColor Yellow

Write-Host "`n[5.1] GET /categories - Categorias" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$BASE_URL/categories" -Method Get
$response | ConvertTo-Json -Depth 10

Write-Host "`n[5.2] GET /users - Utilizadores" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$BASE_URL/users" -Method Get
$response | ConvertTo-Json -Depth 10

Write-Host "`n[5.3] GET /prompts - Prompts" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$BASE_URL/prompts" -Method Get
$response | ConvertTo-Json -Depth 10

Write-Host "`n[5.4] GET /prompts/1/versions - Versoes do prompt 1" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$BASE_URL/prompts/1/versions" -Method Get
$response | ConvertTo-Json -Depth 10

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Testes concluidos!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan