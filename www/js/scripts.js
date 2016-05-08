		//http://www.javascriptlint.com/online_lint.php
		//Funcoes do aplicativo
		var codigo_entidade = 0;
		var arrayLista = [];
		var arrayAgenda = [];
		
		function confirmarClique() {
			if(confirm("Você deseja excluir este registro?")) {
				return true;
			} else {
				return false;
			}
		};
		
		function echeck(str) {

			var at="@";
			var dot=".";
			var lat=str.indexOf(at);
			var lstr=str.length;
			var ldot=str.indexOf(dot);
			if (str.indexOf(at)==-1){
			   //alert("Invalid E-mail ID");
			   return false;
			}

			if (str.indexOf(at)==-1 || str.indexOf(at)==0 || str.indexOf(at)==lstr){
			   //alert("Invalid E-mail ID");
			   return false;
			}

			if (str.indexOf(dot)==-1 || str.indexOf(dot)==0 || str.indexOf(dot)==lstr){
				//alert("Invalid E-mail ID");
				return false;
			}

			 if (str.indexOf(at,(lat+1))!=-1){
				//alert("Invalid E-mail ID");
				return false;
			 }

			 if (str.substring(lat-1,lat)==dot || str.substring(lat+1,lat+2)==dot){
				//alert("Invalid E-mail ID");
				return false;
			 }

			 if (str.indexOf(dot,(lat+2))==-1){
				//alert("Invalid E-mail ID");
				return false;
			 }
			
			 if (str.indexOf(" ")!=-1){
				//alert("Invalid E-mail ID")/
				return false;
			 }

			 return true;				
		}
		
		function pad(s) { 
			return (s < 10) ? '0' + s : s; 
		}
		
		function diasemana(data_selecionada){
			var dia = data_selecionada.getDay();
			var semana=new Array(6);
			semana[0]='Domingo';
			semana[1]='Segunda-Feira';
			semana[2]='Terça-Feira';
			semana[3]='Quarta-Feia';
			semana[4]='Quinta-Feira';
			semana[5]='Sexta-Feira';
			semana[6]='Sábado';
			return semana[dia];
		}
		
		
		//Funcoes do Phonegap
		var isPhoneGapReady = false;
		var isConnected = false;
		var isHighSpeed = false;
		var tipo_conexao = "";
		//$(document).ready(function(){
		document.addEventListener("deviceready", onDeviceReady, false);
		//});
		 
		function onDeviceReady() {
			isPhoneGapReady = true;
			// detect for network access
			networkDetection();
			// attach events for online and offline detection
			document.addEventListener("online", onOnline, false);
			document.addEventListener("offline", onOffline, false);
		}
		
		function networkDetection() {
			if (isPhoneGapReady) {
				
				
				var states = {};
				states[navigator.connection.UNKNOWN]  = 'Unknown connection';
				states[navigator.connection.ETHERNET] = 'Ethernet connection';
				states[navigator.connection.WIFI]     = 'WiFi connection';
				states[navigator.connection.CELL_2G]  = 'Cell 2G connection';
				states[navigator.connection.CELL_3G]  = 'Cell 3G connection';
				states[navigator.connection.CELL_4G]  = 'Cell 4G connection';
				states[navigator.connection.NONE]     = 'No network connection';
				var tipo_conexao = states[navigator.connection.type];
				
				if (tipo_conexao != 'No network connection') {
					isConnected = true;
				}
				
			}	
		}
		
		function onOnline() {
			isConnected = true;
		}
		function onOffline() {
			isConnected = false;
		}
		
		$(document).on('pageshow', '#main', function(){ 
			if (isPhoneGapReady){
				if (isConnected) {
					ListarAgenda();
				} else {
					navigator.vibrate(2000);
					navigator.notification.alert('Não existe conexão com a Internet', alertDismissed, 'FisioAgenda', 'OK');
					$.mobile.changePage("#menu");
				}	
			} else {
				navigator.vibrate(2000);
				navigator.notification.alert('O aplicativo não está pronto!', alertDismissed, 'FisioAgenda', 'OK');
				$.mobile.changePage("#menu");
			}	
		});
		
		
		$(document).on('pageshow', '#listar', function(){ 
			if (isPhoneGapReady){
				if (isConnected) {
					ListaPacientes();
				} else {
					navigator.vibrate(2000);
					navigator.notification.alert('Não existe conexão com a Internet', alertDismissed, 'FisioAgenda', 'OK');
					$.mobile.changePage("#menu");
				}	
			} else {
				navigator.vibrate(2000);
				navigator.notification.alert('O aplicativo não está pronto!', alertDismissed, 'FisioAgenda', 'OK');
				$.mobile.changePage("#menu");
			}	
		});
		
		$(document).on('pageinit', '#faleconosco', function(){  
        $(document).on('click', '#enviar_contato', function() { 
			// catch the form's submit event
		
			var field_tag_css = {
				"background-color": "#FFFF99"
			  };
			var continuar = true;
			var mensagem ="Ocorreram os seguintes erros:\n";
			
			if ($('#nome_contato').val() == "") {
				mensagem = mensagem + 'Prencha o seu nome\n';
				$('#nome_contato').css(field_tag_css);
				continuar = false;
			}

			if ($('#email_contato').val() == "") {
				mensagem = mensagem +  'Digite o endereco de e-mail\n';
				$('#email_contato').css(field_tag_css);
				continuar = false;
			} else {
				if (echeck($('#email_contato').val())==false){
				mensagem = mensagem + 'Preencha corretamente o endereco de e-mail\n';
				continuar = false;
				}
			}


			if ($('#mensagem_contato').val() == "") {
				mensagem = mensagem + 'Prencha a mensagem que deseja enviar\n';
				$('#mensagem_contato').css(field_tag_css);
				continuar = false;
			}
			
			if (isPhoneGapReady){
				if (isConnected) {
					//Continuar processamento
				} else {
					continuar = false;
				}
			} else {
				continuar = false;
			}	
		
			if (continuar){
				// Send data to server through the ajax call
				// action is functionality we want to call and outputJSON is our data
				//formData : $('#check-contato').serialize()
					$.ajax({url: 'http://www.fisioagenda.com.br/xml/ajax_contato.php',
						data: {action : 'enviar', nome: $('#nome_contato').val(), email: $('#email_contato').val(), ddd_telefone: '00', numero_telefone: '00000000', mensagem: $('#mensagem_contato').val()},
						type: 'post',                   
						async: 'true',
                        dataType: 'text',
						beforeSend: function() {
							// This callback function will trigger before data is sent
							$.mobile.loading('show', {
								theme: "a",
								text: "Aguarde...",
								textonly: true,
								textVisible: true
							});
													},
						complete: function() {
							// This callback function will trigger on data sent/received complete
							$.mobile.loading('hide'); // This will hide ajax spinner
						},
						success: function (result) {
							
							if(result =="OK") {
								navigator.notification.alert('Obrigado por enviar sua mensagem!', alertDismissed, 'FisioAgenda', 'OK'); 
								$.mobile.changePage("#index");							
							} else {
							    navigator.notification.alert('Erro ao gravar suas informacoes!', alertDismissed, 'FisioAgenda', 'OK'); 
							}
						},
						error: function (request,error) {
							// This callback function will trigger on unsuccessful action                
							navigator.notification.alert('Houve um erro ao enviar suas informações!', alertDismissed, 'FisioAgenda', 'OK');
						}
					});                   
			} else {
				navigator.notification.alert(mensagem,alertDismissed, 'FisioAgenda', 'OK');
				//return false;
			}           
            return false; // cancel original event to prevent form submitting
        });    
		});
		
		
		$(document).on('pageinit', '#login', function(){  
        $(document).on('click', '#enviar_login', function() { // catch the form's submit event
			
			var field_tag_css = {
				"background-color": "#FFFF99"
			  };
			var continuar = true;
			var mensagem ="Ocorreram os seguintes erros:\n";
			
			if ($('#email_login').val() == "") {
				mensagem = mensagem +  'Digite o endereco de e-mail\n';
				$('#email_login').css(field_tag_css);
				continuar = false;
			} else {
				if (echeck($('#email_login').val())==false){
				mensagem = mensagem + 'Preencha corretamente o endereco de e-mail\n';
				continuar = false;
				}
			}

			if ($('#senha_login').val() == "") {
				mensagem = mensagem + 'Prencha a sua senha\n';
				$('#senha_login').css(field_tag_css);
				continuar = false;
			}
			
		
			if (continuar){
				ValidarLogin($('#email_login').val(), $('#senha_login').val())
				//$.mobile.changePage("#main");                 
			} else {
				navigator.notification.alert(mensagem,alertDismissed, 'FisioAgenda', 'OK');
				//return false;
			}           
            return false; // cancel original event to prevent form submitting
        });    
		});
		
		function MontarElementoLista(){
			$("#loading_agenda").show();
			for	(index2 = 0; index2 < arrayAgenda.length; index2++) {
			
				var tmp_array_data = arrayAgenda[index2];
				var tmp_data = tmp_array_data[0];
				var tmp_horarios = tmp_array_data[1];
				var semana = tmp_array_data[2];
				var nome_div = tmp_data.replace("/", "");
				nome_div = nome_div.replace("/", "");
				
				if (tmp_horarios.length >0){
				
					var retorno = '<div><h3>' + tmp_data + ' - ' +  semana + '</h3>';
					retorno = retorno + '<div id="' + nome_div + '" data-role="collapsible-set">';
					
					
					for	(index = 0; index < tmp_horarios.length; index++) {
						var tmp_array = tmp_horarios[index];
						if (tmp_array[3] == "OCUPADO"){
							retorno = retorno + '<div data-role="collapsible" class="acol">';
							retorno = retorno + '	<h3>' + tmp_array[1] + ' as ' + tmp_array[2] + '</h3>';
							retorno = retorno + '	<p>' + tmp_array[4] + '</p>';
							retorno = retorno + '</div>';
						}
						if (tmp_array[3] == "LIVRE"){
							retorno = retorno + '<div data-role="collapsible" class="bcol">';
							retorno = retorno + '	<h3>' + tmp_array[1] + ' as ' + tmp_array[2] + '</h3>';
							retorno = retorno + '	<p>LIVRE</p>';
							retorno = retorno + '</div>';
						}
						if (tmp_array[3] == "INTERVALO"){
							retorno = retorno + '<div data-role="collapsible" class="ccol">';
							retorno = retorno + '	<h3>' + tmp_array[1] + ' as ' + tmp_array[2] + '</h3>';
							retorno = retorno + '	<p>INTERVALO</p>';
							retorno = retorno + '</div>';
						}
					
					}
					
					retorno = retorno + '</div></div>';
				}
				
				$("#owl-demo").append(retorno);
				//$('#' + nome_div).trigger('create');    
				//$('#' + nome_div).listview('refresh');
				$('#' + nome_div).collapsibleset().trigger('create');
			}
			$("#loading_agenda").hide();
			$(".owl-carousel").owlCarousel({
				autoplay:false,
				margin:10,
				loop:true,
				autoWidth:true,
				autoHeight: true,
				items:1,
				responsive:false,
				nav: false,
				dots: false
			});
			
		}
		
		//Comunicacao com o webservice
		function CancelarAgendamento(codigo_agenda) {
			$.ajax({url: 'http://www.fisioagenda.com.br/xml/ajax_cancelar_agenda.php',
			data: {action : 'enviar', codigo: codigo_agenda, entidade: codigo_entidade},
			type: 'post',                   
			async: 'true',
			dataType: 'text',
			beforeSend: function() {
				// This callback function will trigger before data is sent
				$.mobile.loading('show', {
					theme: "a",
					text: "Aguarde...",
					textonly: true,
					textVisible: true
				});
										},
			complete: function() {
				// This callback function will trigger on data sent/received complete
				$.mobile.loading('hide'); // This will hide ajax spinner
			},
			success: function (result) {
				
				if(result =="OK") {
					navigator.notification.alert('Cancelamento efetuado com sucesso!', alertDismissed, 'FisioAgenda', 'OK'); 
					$.mobile.changePage("#menu");							
				} else {
					navigator.notification.alert('Erro ao cancelar agendamento!', alertDismissed, 'FisioAgenda', 'OK'); 
					$.mobile.changePage("#menu");
				}
			},
			error: function (request,error) {
				// This callback function will trigger on unsuccessful action                
				navigator.notification.alert('Houve um erro ao enviar suas informações!', alertDismissed, 'FisioAgenda', 'OK');
				$.mobile.changePage("#menu");
			}
			});  
		}
		
		function ConfirmarAgendamento(codigo_agenda) {
			$.ajax({url: 'http://www.fisioagenda.com.br/xml/ajax_adicionar_agenda.php',
			data: {action : 'enviar', codigo: codigo_agenda, entidade: codigo_entidade},
			type: 'post',                   
			async: 'true',
			dataType: 'text',
			beforeSend: function() {
				// This callback function will trigger before data is sent
				$.mobile.loading('show', {
					theme: "a",
					text: "Aguarde...",
					textonly: true,
					textVisible: true
				});
										},
			complete: function() {
				// This callback function will trigger on data sent/received complete
				$.mobile.loading('hide'); // This will hide ajax spinner
			},
			success: function (result) {
				
				if(result =="OK") {
					navigator.notification.alert('Cancelamento efetuado com sucesso!', alertDismissed, 'FisioAgenda', 'OK'); 
					$.mobile.changePage("#menu");							
				} else {
					navigator.notification.alert('Erro ao cancelar agendamento!', alertDismissed, 'FisioAgenda', 'OK'); 
					$.mobile.changePage("#menu");
				}
			},
			error: function (request,error) {
				// This callback function will trigger on unsuccessful action                
				navigator.notification.alert('Houve um erro ao enviar suas informações!', alertDismissed, 'FisioAgenda', 'OK');
				$.mobile.changePage("#menu");
			}
			});  
		}
		
		function AgendamentosMarcados() {
			$.ajax({
				type: "GET",
				url: 'http://www.fisioagenda.com.br/xml/xml_lista.php',
				data: {action : 'enviar', codigo: codigo_entidade},
				dataType: "xml",
				success: function(data) {
					$(data).find('agenda').each(function(){
						var codigo = $(this).find("codigo").text();
						var data = $(this).find("data").text();
						var horario_inicio = $(this).find("horario_inicio").text();
						var horario_final = $(this).find("horario_final").text();
						var status = $(this).find("status").text();
						var dados_temporarios = [codigo, data, horario_inicio, horario_final, status];
						arrayLista.push(dados_temporarios);
					});
				},
				error: function (request,error) {
					navigator.notification.alert('Houve um erro ao recuperar suas informações!', alertDismissed, 'FisioAgenda', 'OK');
					$.mobile.changePage("#menu");
				}
			});
		}
		
		function ListarAgenda() {
			
			$.ajax({
				type: "POST",
				url: 'http://www.fisioagenda.com.br/xml/xml_agenda_cliente.php',
				data: {action : 'enviar', empresa: codigo_entidade},
				dataType: "xml",
				success: function(data) {
					
					$(data).find('agenda').each(function(){
						var data = $(this).find("data").text();
						var semana = $(this).find("semana").text();
						var horarios = [];
						$(this).find('horarios').each(function(){
							$(this).find('horario').each(function(){
								var codigo = $(this).find("codigo").text();
								var paciente = $(this).find("paciente").text();
								var horario_inicial = $(this).find("horario_inicial").text();
								var horario_final = $(this).find("horario_final").text();
								var status = $(this).find("status").text();
								var dados_temporarios2 = [codigo, horario_inicial, horario_final, status, paciente];
								horarios.push(dados_temporarios2);
							});
						});
					
						var dados_temporarios = [data, horarios, semana];
						arrayAgenda.push(dados_temporarios);
					});
					
					MontarElementoLista();
				},
				error: function (request,error) {
					//navigator.notification.alert('Houve um erro ao recuperar suas informações!', alertDismissed, 'FisioAgenda', 'OK');
					//$.mobile.changePage("#menu");
				}
			});
		}
		
		function ValidarLogin(login_informado, senha_informada) {
			
			$.ajax({url: 'http://www.fisioagenda.com.br/xml/ajax_login_cliente.php',
			data: {acao : 'entrar', login: login_informado, senha: senha_informada},
			type: 'post',                   
			async: 'true',
			dataType: 'text',
			beforeSend: function() {
				// This callback function will trigger before data is sent
				$.mobile.loading('show', {
					theme: "a",
					text: "Aguarde...",
					textonly: true,
					textVisible: true
				});
										},
			complete: function() {
				// This callback function will trigger on data sent/received complete
				$.mobile.loading('hide'); // This will hide ajax spinner
			},
			success: function (result) {
				
				if(result =="0") {
					navigator.notification.alert('O login ou a senha informada não foram localizados!', alertDismissed, 'FisioAgenda', 'OK'); 
				} else {
					if (result =="ERRO") {
						navigator.notification.alert('Houve um erro ao consultar nosso sistema!', alertDismissed, 'FisioAgenda', 'OK'); 
					} else {
						codigo_entidade = result;
						$.mobile.changePage("#menu");
					}
				}
			},
			error: function (request,error) {
				// This callback function will trigger on unsuccessful action                
				navigator.notification.alert('Houve um erro ao enviar suas informações!', alertDismissed, 'FisioAgenda', 'OK');
			}
			});  
		}
		
		//Carregando Pacientes
	function ListaPacientes(){
		$("#listview").hide();
		$("#myFilter").hide();
		$("#loading").show();
		$.ajax({
		type: "GET",
		url: "http://www.fisioagenda.com.br/xml/xml_pacientes.php?empresa=46",
		dataType: "xml",
		success: function(data) {
			var output = "";
			$('#listview').empty();
			$(data).find('paciente').each(function(){
				var nome = $(this).find("nome").text();
				var sexo = $(this).find("sexo").text();
				var idade = $(this).find("idade").text();
				var telefone = $(this).find("telefone").text();
				var data_cadastro = $(this).find("data_cadastro").text();
				var status = $(this).find("status").text();
				var imagem = "";
				if (sexo =="M"){
					 imagem = "masculino.png";
				} else {
					imagem = "feminino.png";
				}
				
				output += '<li><a href="#"><img style="height:100%" src="img/' + imagem + '" /><h3>' + nome + '</h3><p>' + telefone + '</p><p>Idade:' + idade + '</p><p>Data de Cadastro:' + data_cadastro + '</p></a></li>';
			});
			
			$('#listview').append(output).listview('refresh');
			$("#listview").listview("refresh");
			$("#listview").show();
			$("#myFilter").show();
			$("#loading").hide();
			}
		});
	}		

	