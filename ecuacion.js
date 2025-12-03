
        // Variables globales
        let firstDegreeSolved = false;
        let secondDegreeSolved = false;
        
        // Inicializar la aplicación
        document.addEventListener('DOMContentLoaded', function() {
            // Actualizar ecuaciones en tiempo real
            document.getElementById('coef-a').addEventListener('input', updateFirstDegreeEquation);
            document.getElementById('coef-b').addEventListener('input', updateFirstDegreeEquation);
            document.getElementById('coef-a2').addEventListener('input', updateSecondDegreeEquation);
            document.getElementById('coef-b2').addEventListener('input', updateSecondDegreeEquation);
            document.getElementById('coef-c2').addEventListener('input', updateSecondDegreeEquation);
            
            // Botones de resolución
            document.getElementById('solve-first-degree').addEventListener('click', solveFirstDegree);
            document.getElementById('solve-second-degree').addEventListener('click', solveSecondDegree);
            
            // Inicializar ecuaciones
            updateFirstDegreeEquation();
            updateSecondDegreeEquation();
            
            // Mostrar gráfico inicial para primer grado
            drawFirstDegreeGraph(2, 4);
            
            // Mostrar gráfico inicial para segundo grado
            drawSecondDegreeGraph(1, -3, 2);
        });
        
        // Actualizar ecuación de primer grado en tiempo real
        function updateFirstDegreeEquation() {
            const a = parseFloat(document.getElementById('coef-a').value) || 0;
            const b = parseFloat(document.getElementById('coef-b').value) || 0;
            
            let equation = '';
            if (a !== 0) {
                equation += `${formatCoefficient(a)}x`;
                if (b !== 0) {
                    equation += ` ${b > 0 ? '+' : '-'} ${Math.abs(b)}`;
                }
            } else {
                if (b !== 0) {
                    equation += `${b}`;
                } else {
                    equation += '0';
                }
            }
            
            equation += ' = 0';
            document.getElementById('first-degree-equation').innerHTML = equation;
        }
        
        // Actualizar ecuación de segundo grado en tiempo real
        function updateSecondDegreeEquation() {
            const a = parseFloat(document.getElementById('coef-a2').value) || 0;
            const b = parseFloat(document.getElementById('coef-b2').value) || 0;
            const c = parseFloat(document.getElementById('coef-c2').value) || 0;
            
            let equation = '';
            if (a !== 0) {
                equation += `${formatCoefficient(a)}x²`;
            }
            
            if (b !== 0) {
                equation += ` ${b > 0 ? '+' : '-'} ${Math.abs(b)}x`;
            }
            
            if (c !== 0) {
                equation += ` ${c > 0 ? '+' : '-'} ${Math.abs(c)}`;
            }
            
            if (equation === '') {
                equation = '0';
            }
            
            equation += ' = 0';
            document.getElementById('second-degree-equation').innerHTML = equation;
        }
        
        // Formatear coeficiente para mostrar
        function formatCoefficient(coef) {
            if (coef === 1) return '';
            if (coef === -1) return '-';
            return coef;
        }
        
        // Resolver ecuación de primer grado
        function solveFirstDegree() {
            const a = parseFloat(document.getElementById('coef-a').value);
            const b = parseFloat(document.getElementById('coef-b').value);
            
            // Validación
            if (isNaN(a) || isNaN(b)) {
                showResult('first-degree-result', 'Por favor, ingresa valores numéricos válidos.', 'danger');
                return;
            }
            
            if (a === 0) {
                if (b === 0) {
                    showResult('first-degree-result', 'La ecuación tiene infinitas soluciones (es una identidad).', 'warning');
                } else {
                    showResult('first-degree-result', 'La ecuación no tiene solución (es contradictoria).', 'danger');
                }
                return;
            }
            
            // Calcular solución
            const solution = -b / a;
            
            // Mostrar resultado
            const resultHTML = `
                <h5 class="mb-2">Solución encontrada:</h5>
                <div class="equation-display text-center mb-2">
                    x = ${solution.toFixed(4)}
                </div>
                <p class="mb-0">La ecuación tiene una solución única.</p>
            `;
            showResult('first-degree-result', resultHTML, 'success');
            
            // Mostrar pasos de la solución
            showFirstDegreeSteps(a, b, solution);
            
            // Dibujar gráfico
            drawFirstDegreeGraph(a, b);
            
            firstDegreeSolved = true;
        }
        
        // Mostrar pasos de solución para primer grado
        function showFirstDegreeSteps(a, b, solution) {
            const stepsContainer = document.getElementById('first-degree-steps');
            let stepsHTML = `
                <h6 class="text-accent mb-3"><i class="bi bi-list-ol me-2"></i>Pasos de la solución:</h6>
                <div class="solution-step">
                    <strong>Paso 1:</strong> Ecuación original<br>
                    ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = 0
                </div>
            `;
            
            if (b !== 0) {
                stepsHTML += `
                    <div class="solution-step">
                        <strong>Paso 2:</strong> Restar ${b} en ambos lados<br>
                        ${a}x = ${-b}
                    </div>
                `;
            }
            
            stepsHTML += `
                <div class="solution-step">
                    <strong>Paso ${b !== 0 ? '3' : '2'}:</strong> Dividir ambos lados entre ${a}<br>
                    x = ${-b} / ${a}
                </div>
                <div class="solution-step">
                    <strong>Paso ${b !== 0 ? '4' : '3'}:</strong> Simplificar<br>
                    x = ${solution.toFixed(4)}
                </div>
            `;
            
            stepsContainer.innerHTML = stepsHTML;
        }
        
        // Dibujar gráfico para ecuación de primer grado
        function drawFirstDegreeGraph(a, b) {
            const graphContainer = document.getElementById('first-degree-graph');
            const linearLine = document.getElementById('linear-line');
            const rootPoint = document.getElementById('root-point');
            
            if (a === 0) {
                // Línea horizontal
                linearLine.style.transform = 'rotate(0deg)';
                rootPoint.style.display = 'none';
                return;
            }
            
            // Calcular pendiente y ángulo
            const solution = -b / a;
            
            // Posicionar el punto de la raíz
            // Normalizar la solución para mostrarla en el gráfico
            let xPos = 50 + (solution * 10); // Escala ajustada
            xPos = Math.max(10, Math.min(90, xPos)); // Limitar al área visible
            
            rootPoint.style.left = `${xPos}%`;
            rootPoint.style.top = '50%';
            rootPoint.style.display = 'block';
            
            // Calcular ángulo de la línea basado en la pendiente
            const angle = Math.atan(a) * (180 / Math.PI);
            linearLine.style.transform = `rotate(${angle}deg)`;
            
            // Animación para el punto
            rootPoint.style.animation = 'pulse 1.5s infinite';
        }
        
        // Resolver ecuación de segundo grado
        function solveSecondDegree() {
            const a = parseFloat(document.getElementById('coef-a2').value);
            const b = parseFloat(document.getElementById('coef-b2').value);
            const c = parseFloat(document.getElementById('coef-c2').value);
            
            // Validación
            if (isNaN(a) || isNaN(b) || isNaN(c)) {
                showResult('second-degree-result', 'Por favor, ingresa valores numéricos válidos.', 'danger');
                return;
            }
            
            if (a === 0) {
                showResult('second-degree-result', 'El coeficiente "a" no puede ser cero en una ecuación de segundo grado.', 'danger');
                return;
            }
            
            // Calcular discriminante
            const discriminant = b * b - 4 * a * c;
            
            // Calcular soluciones
            let root1, root2;
            let resultHTML = '';
            
            if (discriminant > 0) {
                // Dos soluciones reales
                root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                
                resultHTML = `
                    <h5 class="mb-2">Dos soluciones reales:</h5>
                    <div class="equation-display text-center mb-2">
                        x₁ = ${root1.toFixed(4)}<br>
                        x₂ = ${root2.toFixed(4)}
                    </div>
                    <p class="mb-0">Discriminante: Δ = ${discriminant.toFixed(4)} > 0</p>
                `;
                showResult('second-degree-result', resultHTML, 'success');
            } else if (discriminant === 0) {
                // Una solución real (doble)
                root1 = -b / (2 * a);
                
                resultHTML = `
                    <h5 class="mb-2">Una solución real (doble):</h5>
                    <div class="equation-display text-center mb-2">
                        x = ${root1.toFixed(4)}
                    </div>
                    <p class="mb-0">Discriminante: Δ = 0</p>
                `;
                showResult('second-degree-result', resultHTML, 'warning');
                root2 = root1;
            } else {
                // Soluciones complejas
                const realPart = -b / (2 * a);
                const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
                
                resultHTML = `
                    <h5 class="mb-2">Dos soluciones complejas:</h5>
                    <div class="equation-display text-center mb-2">
                        x₁ = ${realPart.toFixed(4)} + ${imaginaryPart.toFixed(4)}i<br>
                        x₂ = ${realPart.toFixed(4)} - ${imaginaryPart.toFixed(4)}i
                    </div>
                    <p class="mb-0">Discriminante: Δ = ${discriminant.toFixed(4)} < 0</p>
                `;
                showResult('second-degree-result', resultHTML, 'info');
                root1 = root2 = null;
            }
            
            // Mostrar pasos de la solución
            showSecondDegreeSteps(a, b, c, discriminant, root1, root2);
            
            // Dibujar gráfico (solo si hay soluciones reales)
            if (discriminant >= 0) {
                drawSecondDegreeGraph(a, b, c);
            } else {
                // Para soluciones complejas, mostrar gráfico básico
                drawSecondDegreeGraph(a, b, c, true);
            }
            
            secondDegreeSolved = true;
        }
        
        // Mostrar pasos de solución para segundo grado
        function showSecondDegreeSteps(a, b, c, discriminant, root1, root2) {
            const stepsContainer = document.getElementById('second-degree-steps');
            let stepsHTML = `
                <h6 class="text-accent mb-3"><i class="bi bi-list-ol me-2"></i>Pasos de la solución:</h6>
                <div class="solution-step">
                    <strong>Paso 1:</strong> Identificar coeficientes<br>
                    a = ${a}, b = ${b}, c = ${c}
                </div>
                <div class="solution-step">
                    <strong>Paso 2:</strong> Calcular el discriminante<br>
                    Δ = b² - 4ac = ${b}² - 4·${a}·${c} = ${discriminant.toFixed(4)}
                </div>
            `;
            
            if (discriminant > 0) {
                stepsHTML += `
                    <div class="solution-step">
                        <strong>Paso 3:</strong> Aplicar fórmula cuadrática (Δ > 0)<br>
                        x = [-b ± √Δ] / 2a
                    </div>
                    <div class="solution-step">
                        <strong>Paso 4:</strong> Calcular las dos soluciones<br>
                        x₁ = [${-b} + √${discriminant.toFixed(4)}] / ${2*a} = ${root1.toFixed(4)}<br>
                        x₂ = [${-b} - √${discriminant.toFixed(4)}] / ${2*a} = ${root2.toFixed(4)}
                    </div>
                `;
            } else if (discriminant === 0) {
                stepsHTML += `
                    <div class="solution-step">
                        <strong>Paso 3:</strong> Aplicar fórmula cuadrática (Δ = 0)<br>
                        x = -b / 2a
                    </div>
                    <div class="solution-step">
                        <strong>Paso 4:</strong> Calcular la solución doble<br>
                        x = ${-b} / ${2*a} = ${root1.toFixed(4)}
                    </div>
                `;
            } else {
                const realPart = -b / (2 * a);
                const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
                
                stepsHTML += `
                    <div class="solution-step">
                        <strong>Paso 3:</strong> Aplicar fórmula cuadrática (Δ < 0)<br>
                        x = [-b ± i√|Δ|] / 2a
                    </div>
                    <div class="solution-step">
                        <strong>Paso 4:</strong> Calcular las soluciones complejas<br>
                        x₁ = ${realPart.toFixed(4)} + ${imaginaryPart.toFixed(4)}i<br>
                        x₂ = ${realPart.toFixed(4)} - ${imaginaryPart.toFixed(4)}i
                    </div>
                `;
            }
            
            stepsContainer.innerHTML = stepsHTML;
        }
        
        // Dibujar gráfico para ecuación de segundo grado
        function drawSecondDegreeGraph(a, b, c, complex = false) {
            const parabola = document.getElementById('parabola');
            const root1Point = document.getElementById('root1-point');
            const root2Point = document.getElementById('root2-point');
            const vertexPoint = document.getElementById('vertex-point');
            
            // Calcular vértice
            const vertexX = -b / (2 * a);
            const vertexY = a * vertexX * vertexX + b * vertexX + c;
            
            // Calcular raíces
            const discriminant = b * b - 4 * a * c;
            let root1, root2;
            
            if (discriminant >= 0) {
                root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                
                // Posicionar puntos de raíces
                // Normalizar para mostrarlos en el gráfico
                let root1Pos = 50 + (root1 * 15); // Escala ajustada
                let root2Pos = 50 + (root2 * 15);
                
                root1Pos = Math.max(10, Math.min(90, root1Pos));
                root2Pos = Math.max(10, Math.min(90, root2Pos));
                
                root1Point.style.left = `${root1Pos}%`;
                root1Point.style.top = '50%';
                root1Point.style.display = 'block';
                
                root2Point.style.left = `${root2Pos}%`;
                root2Point.style.top = '50%';
                root2Point.style.display = 'block';
                
                // Animación para los puntos
                root1Point.style.animation = 'pulse 1.5s infinite';
                root2Point.style.animation = 'pulse 1.5s infinite 0.5s';
                
                // Mostrar vértice
                let vertexXPos = 50 + (vertexX * 15);
                let vertexYPos = 50 - (vertexY * 2); // Escala vertical ajustada
                
                vertexXPos = Math.max(10, Math.min(90, vertexXPos));
                vertexYPos = Math.max(10, Math.min(90, vertexYPos));
                
                vertexPoint.style.left = `${vertexXPos}%`;
                vertexPoint.style.top = `${vertexYPos}%`;
                vertexPoint.style.display = 'block';
                vertexPoint.style.animation = 'floating 3s infinite';
            } else {
                // Para soluciones complejas, ocultar puntos de raíces
                root1Point.style.display = 'none';
                root2Point.style.display = 'none';
                
                // Mostrar solo vértice
                let vertexXPos = 50 + (vertexX * 15);
                let vertexYPos = 50 - (vertexY * 2);
                
                vertexXPos = Math.max(10, Math.min(90, vertexXPos));
                vertexYPos = Math.max(10, Math.min(90, vertexYPos));
                
                vertexPoint.style.left = `${vertexXPos}%`;
                vertexPoint.style.top = `${vertexYPos}%`;
                vertexPoint.style.display = 'block';
                vertexPoint.style.animation = 'floating 3s infinite';
            }
            
            // Ajustar parábola según el coeficiente a
            let curvature = a > 0 ? 1 : -1; // 1 para concavidad hacia arriba, -1 para abajo
            let parabolaHeight = Math.min(40, Math.abs(a) * 20);
            
            // Crear efecto de parábola con transformación CSS
            parabola.style.transform = `scaleY(${curvature * parabolaHeight / 100})`;
            parabola.style.top = `${50 - (curvature * parabolaHeight / 2)}%`;
        }
        
        // Mostrar resultado con animación
        function showResult(elementId, content, type = 'info') {
            const resultElement = document.getElementById(elementId);
            
            // Definir colores según tipo
            let borderColor = 'var(--accent-color)';
            if (type === 'success') borderColor = 'var(--success-color)';
            if (type === 'warning') borderColor = 'var(--warning-color)';
            if (type === 'danger') borderColor = 'var(--danger-color)';
            
            // Aplicar animación y contenido
            resultElement.style.borderLeftColor = borderColor;
            resultElement.innerHTML = content;
            
            // Añadir animación
            resultElement.style.animation = 'none';
            setTimeout(() => {
                resultElement.style.animation = 'fadeIn 0.5s ease';
            }, 10);
        }
    