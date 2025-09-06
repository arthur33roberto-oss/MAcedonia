const BASE_URL = window.location.hostname === 'localhost' ? window.location.origin + '/sermilmob' : window.location.origin;

// DataTables defaults
const dataTableDef = {
    "sPaginationType": "full_numbers",
    "oLanguage": {
      "sProcessing":   "Processando...",
      "sLengthMenu":   "<b>Exibir:</b> _MENU_",
      "sZeroRecords":  "Nao foram encontrados resultados",
      "sInfo":         "Exibindo de _START_ a _END_ de _TOTAL_ registros",
      "sInfoEmpty":    "Exibindo de 0 a 0 de 0 registros",
      "sInfoFiltered": "(filtrado de _MAX_ registros no total)",
      "sInfoPostFix":  "",
      "sSearch":       "<b>Buscar:</b>",
      "sUrl":          "",
      "oPaginate": {
        "sFirst":    "<i class='fas fa-fast-backward'></i>",
        "sPrevious": "<i class='fas fa-backward'></i>",
        "sNext":     "<i class='fas fa-forward'></i>",
        "sLast":     "<i class='fas fa-fast-forward'></i>"
      }
    }
};

// Converte data base64 to blob
function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;
  const byteCharacters = atob(b64Data);
  let byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    let byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

// Transforma parametros da URL em variável JS (results)
// Exemplo: declarar no JS a chamada "const ano = urlParam('ano');"
// O parâmetro ano será copiado para a váriavel ano no JS
const urlParam = (name) => {
  const results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  return results == null ?  null : results[1] || 0;
}

// Adiciona 0s a esquerda do número
function zeroPad(num, places) {
  const zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

// Adiciona __/__/____ no campo data
function addSlash(t){
  if(t.value.length === 2){t.value += '/';}
  if(t.value.length === 5){t.value += '/';}
}

Date.prototype.ddmmyyyy = function() {
  const yyyy = this.getFullYear().toString();
  const mm = (this.getMonth()+1).toString();
  const dd  = this.getDate().toString();
  return (dd[1]?dd:"0"+dd[0]) + '/' + (mm[1]?mm:"0"+mm[0]) + '/' + yyyy;
};

// Formata data(dd/mm/aaaa)
function fmtData(dateObject) {
  const d = new Date(dateObject);
  d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000); // JS subtrai 1 hora, essa é correção!
  return d.ddmmyyyy();
}

// Limpeza de erros de formulario
function clearError(input) {
  if($(input).hasClass('is-invalid')){
    $(input).toggleClass('is-invalid');
    $(input).addClass('is-valid');
    $(input).siblings('.form-text').html("");
  }
}

async function fetchCep(cep, end, bai) {
  const codigo = $.trim(cep.val());
  const URL_CEP = 'https://api.eb.mil.br/correios/rest/v1/cep?CEP=' + codigo;
  try {
    const response = await fetch(URL_CEP);
    if (response.status === 200) {
      const data = await response.json();
      end.val(data.TIPO_LOGRADOURO + ' ' + data.LOGRADOURO);
      bai.val(data.BAIRRO);
    }
  } catch(error){
    console.error(error);
  }
}

async function fetchDominio(id, valor, lista, selected, opcional=true) {
  const URL_DOMINIOS = BASE_URL + '/dominios?id=' + id + '&valor=' + valor;
  const select_elem = document.getElementById(lista);
  select_elem.length = 0;
  try {
    const response = await fetch(URL_DOMINIOS);
    if (response.status === 200) {
      const data = await response.json();
      select_elem.disabled = false;
      opcional ? select_elem.add(new Option('--- Selecione ---','')) : null;
      data.forEach(d => select_elem.add(new Option(d.descricao,d.id)));
      selected != null ? select_elem.value = selected : null;
    }
  } catch(error){
    select_elem.disabled = true;
    console.error(error);
  }
}
