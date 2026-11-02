/* paises.js — Lista única de países (en español) para "País de Residencia" y "País (Nacionalidad)".
   Uso:   <script src="paises.js"></script>
          llenarSelectPaises(document.getElementById('reg-pais'), 'Perú');
   Para agregar/quitar países: edita solo el arreglo PAISES_ES. */
(function (w) {
  var PAISES_ES = [
  "Afganistán", "Albania", "Alemania", "Andorra", "Angola", "Antigua y Barbuda", "Arabia Saudita", "Argelia", "Argentina", "Armenia", "Australia", "Austria", "Azerbaiyán", "Bahamas", "Bahréin", "Bangladesh", "Barbados", "Bélgica", "Belice", "Benín", "Bielorrusia", "Bolivia", "Bosnia y Herzegovina", "Botsuana", "Brasil", "Brunéi", "Bulgaria", "Burkina Faso", "Burundi", "Bután", "Cabo Verde", "Camboya", "Camerún", "Canadá", "Catar", "Chad", "Chile", "China", "Chipre", "Ciudad del Vaticano", "Colombia", "Comoras", "Congo", "Corea del Norte", "Corea del Sur", "Costa de Marfil", "Costa Rica", "Croacia", "Cuba", "Dinamarca", "Dominica", "Ecuador", "Egipto", "El Salvador", "Emiratos Árabes Unidos", "Eritrea", "Eslovaquia", "Eslovenia", "España", "Estados Unidos", "Estonia", "Esuatini", "Etiopía", "Filipinas", "Finlandia", "Fiyi", "Francia", "Gabón", "Gambia", "Georgia", "Ghana", "Granada", "Grecia", "Guatemala", "Guinea", "Guinea Ecuatorial", "Guinea-Bisáu", "Guyana", "Haití", "Honduras", "Hong Kong", "Hungría", "India", "Indonesia", "Irak", "Irán", "Irlanda", "Islandia", "Islas Marshall", "Islas Salomón", "Israel", "Italia", "Jamaica", "Japón", "Jordania", "Kazajistán", "Kenia", "Kirguistán", "Kiribati", "Kosovo", "Kuwait", "Laos", "Lesoto", "Letonia", "Líbano", "Liberia", "Libia", "Liechtenstein", "Lituania", "Luxemburgo", "Macao", "Macedonia del Norte", "Madagascar", "Malasia", "Malaui", "Maldivas", "Mali", "Malta", "Marruecos", "Mauricio", "Mauritania", "México", "Micronesia", "Moldavia", "Mónaco", "Mongolia", "Montenegro", "Mozambique", "Myanmar", "Myanmar (Birmania)", "Namibia", "Nauru", "Nepal", "Nicaragua", "Níger", "Nigeria", "Noruega", "Nueva Zelanda", "Omán", "Países Bajos", "Pakistán", "Palaos", "Palestina", "Panamá", "Papúa Nueva Guinea", "Paraguay", "Perú", "Polonia", "Portugal", "Puerto Rico", "Reino Unido", "República Centroafricana", "República Checa", "República Democrática del Congo", "República Dominicana", "Ruanda", "Rumanía", "Rusia", "Samoa", "San Cristóbal y Nieves", "San Marino", "San Vicente y las Granadinas", "Santa Lucía", "Santo Tomé y Príncipe", "Senegal", "Serbia", "Seychelles", "Sierra Leona", "Singapur", "Siria", "Somalia", "Sri Lanka", "Sudáfrica", "Sudán", "Sudán del Sur", "Suecia", "Suiza", "Surinam", "Tailandia", "Taiwán", "Tanzania", "Tayikistán", "Timor Oriental", "Timor-Leste", "Togo", "Tonga", "Trinidad y Tobago", "Túnez", "Turkmenistán", "Turquía", "Tuvalu", "Ucrania", "Uganda", "Uruguay", "Uzbekistán", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Yibuti", "Zambia", "Zimbabue"
];

  // Llena un <select>. Si el valor guardado no está en la lista (dato antiguo), lo agrega para no perderlo.
  function llenarSelectPaises(sel, valorActual, placeholder) {
    if (!sel) return;
    var html = '<option value="">' + (placeholder || 'Seleccionar...') + '</option>';
    PAISES_ES.forEach(function (p) { html += '<option value="' + p + '">' + p + '</option>'; });
    sel.innerHTML = html;
    if (valorActual) fijarValorPais(sel, valorActual);
  }
  function fijarValorPais(sel, valor) {
    if (!sel || !valor) return;
    var existe = Array.prototype.some.call(sel.options, function (o) { return o.value === valor; });
    if (!existe) { var op = document.createElement('option'); op.value = valor; op.textContent = valor; sel.appendChild(op); }
    sel.value = valor;
  }
  w.PAISES_ES = PAISES_ES;
  w.llenarSelectPaises = llenarSelectPaises;
  w.fijarValorPais = fijarValorPais;
})(window);
