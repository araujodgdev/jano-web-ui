import { useState } from "react";
import axios from "axios";
import TextField from "../components/TextField";
import Response from "../components/Response";
import ButtonSystem from "../components/ButtonSystem";
import { AudioLines, Ear, Power, Send } from "lucide-react";

export default function App() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [data, setData] = useState("");
  const [ipnao, setIpnao] = useState("");
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSend] = useState(false);

  const fetchQuestion = async () => {
    setError("");
    setResponse(""); // Limpa a resposta anterior
    setLoading(true);
    try {
      const res = await axios.post(`/gemini/question`, { question });
      setData(res.data);
      setResponse(res.data.response || "Resposta não encontrada."); // Atualiza a resposta atual
      setSend(true);
    } catch (error) {
      console.error(error);
      setError("Erro ao buscar a resposta. Tente novamente.");
      setSend(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchSend = async () => {
    setError("");
    try {
      const ttsResponse = await axios.post(`/nao/ask`, { response: data.response, robot_ip: ipnao });
      console.log(ttsResponse);
    } catch (error) {
      console.error(error);
      setError("Erro ao enviar a resposta. Tente novamente.");
    } finally {
      setLoading(false);
      // setResponse(""); // Limpa a resposta após o envio
      // setSend(false);
      // setQuestion(""); // Limpa a pergunta
    }
  };

  const onChangeIP = (e) => {
    setIpnao(e.target.value);
  };

  const onChangeQuestion = (e) => {
    setQuestion(e.target.value);
  };

  const eraseField = () => {
    setSend(false);
    setQuestion("");
    setResponse("");
  };

  const onKeyDownQuestion = (e) => {
    if (e.which === 13) {
      fetchQuestion();
    } else if (e.which === 27) {
      eraseField();
    }
  };

  return (
    <section className="w-full h-full flex flex-col justify-start gap-10 items-center container px-6">
      {step === 0 ? (
        <section className="flex flex-col space-y-2">
          <TextField
            title="IP"
            name="input_ip"
            value={ipnao}
            onChangeField={onChangeIP}
            placeholder="Digite o IP"
          />
          <button
            className="flex items-center justify-center font-bold text-2xl gap-3 bg-blue-500 text-white p-3 rounded-md"
            onClick={() => setStep(1)}>
            <Power size={26} />
            Conectar
          </button>
        </section>
      ) : (
        <section className="flex flex-col space-y-2"  >
          <TextField
            title="Pergunta"
            name="input_pergunta"
            value={question}
            onChangeField={onChangeQuestion}
            onKeyDownField={onKeyDownQuestion}
            placeholder="Digite a pergunta"
          />
          <ButtonSystem
            // função para escutar a pergunta pelo Jano
            className='bg-gray-500'
          >
            <Ear size={26} />
            Escutar
          </ButtonSystem>
          {
            sent ? (
              <>
                <ButtonSystem
                  // função para buscar a resposta no Jano
                  className='bg-blue-500'
                  fetchQuestion={fetchSend}
                >
                  <AudioLines size={26} />
                  Falar
                </ButtonSystem>
                <span className="text-gray-400 text-xs max-w-80">Respostas geradas por IA e podem não ser 100% precisas.</span>
              </>
            ) : (
              <ButtonSystem
                // função para enviar a resposta para o NAO
                className='bg-blue-500'
                fetchQuestion={fetchQuestion}
              >
                <Send size={26} />
                Enviar
              </ButtonSystem>

            )
          }
        </section>
      )}
      <Response
        response={response}
        loading={loading}
        error={error}
      />
    </section>
  );
}
