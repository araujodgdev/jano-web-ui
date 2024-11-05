# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify
from naoqi import ALProxy

app = Flask(__name__)

@app.route('/ask', methods=['POST'])
def ask_question():

    # Obtém a pergunta do corpo da requisição
    data = request.json  # Obtém o JSON da requisição
    resposta = data.get('response')  # Usa .get() para evitar KeyError

    # Pega o IP do Front e configura no NAO
    ROBOT_IP = data.get('robot_ip')
    tts = ALProxy("ALTextToSpeech", str(ROBOT_IP), 9559)
    tts.setLanguage("Brazilian")

    tts.say("Olá, meu nome é Jano!")

    # Verifica se a resposta está vazia ou não foi fornecida
    if not resposta:
        tts.say("Desculpe, não recebi uma pergunta.")
        return jsonify({'error': 'Pergunta não fornecida'}), 400  # Código 400 para erro de requisição

    # Converte a resposta para o formato correto
    if isinstance(resposta, unicode):  # type: ignore
        resposta = resposta.encode('utf-8')
    elif not isinstance(resposta, str):
        resposta = str(resposta)

    # O robô diz a resposta
    tts.say(resposta)

    # Retornando a resposta em JSON
    return jsonify({'response': resposta, 'robot_ip': ROBOT_IP}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Executa a API na porta 5000
