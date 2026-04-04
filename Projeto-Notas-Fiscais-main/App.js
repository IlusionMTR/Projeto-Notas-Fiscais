import React, { useState } from 'react';
import { SafeAreaView, Alert, Platform } from 'react-native'; // Importei Platform para diferenciar
import Login from './componentes/Login';
import Dashboard from './componentes/Dashboard';
import Cadastro from './componentes/Cadastro';

const API_URL = 'http://localhost:3000';

export default function App() {
  const [tela, setTela] = useState('login');
  const [usuario, setUsuario] = useState(''); 
  const [senha, setSenha] = useState('');

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [pedidos, setPedidos] = useState([
    { id: '1', cliente: 'João Silva', valor: 'R$ 150,00', status: 'Pendente' },
    { id: '2', cliente: 'Maria Oliveira', valor: 'R$ 89,90', status: 'Emitida' },
  ]);

  // Função Universal de Alerta (Funciona em Web e Mobile)
  const exibirAlerta = (titulo, mensagem) => {
    if (Platform.OS === 'web') {
      alert(`${titulo}: ${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  const login = async () => {
    console.log("Tentando login com:", usuario); // Debug no console

    if (!usuario || !senha) {
      exibirAlerta('Erro', 'Preencha e-mail e senha.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usuario, senha: senha })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login bem-sucedido!");
        setTela('dashboard');
        setUsuario('');
        setSenha('');
      } else {
        // Pega o erro vindo do backend ou usa a mensagem padrão
        console.log("Falha no login:", data.erro);
        exibirAlerta('Erro', data.erro || 'Usuário ou senha incorretos');
      }
    } catch (error) {
      console.error("Erro na requisição de login:", error);
      exibirAlerta('Erro de Conexão', 'O servidor está desligado ou o IP está errado.');
    }
  };

  const finalizarCadastro = async () => {
    console.log("Tentando cadastrar:", email);

    if (!nome || !email || !senha || !confirmarSenha) {
      exibirAlerta('Erro', 'Preencha todos os campos!');
      return;
    }

    if (senha !== confirmarSenha) {
      exibirAlerta('Erro', 'As senhas não coincidem!');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });

      const data = await response.json();

      if (response.ok) {
        exibirAlerta('Sucesso', 'Cadastro realizado!');
        setTela('login');
      } else {
        exibirAlerta('Erro', data.erro || 'Erro ao cadastrar.');
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      exibirAlerta('Erro de Conexão', 'Não foi possível conectar ao servidor.');
    }
  };

  const emitirNota = (id) => {
    exibirAlerta('Nota Fiscal', `Emitindo nota ${id}`);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {tela === 'login' ? (
        <Login 
          usuario={usuario} 
          setUsuario={setUsuario} 
          senha={senha} 
          setSenha={setSenha} 
          onLogin={login}
          onIrParaCadastro={() => setTela('cadastro')} 
        />
      ) : tela === 'cadastro' ? (
        <Cadastro 
          nome={nome} setNome={setNome}
          email={email} setEmail={setEmail}
          senha={senha} setSenha={setSenha}
          confirmarSenha={confirmarSenha} setConfirmarSenha={setConfirmarSenha}
          onCadastro={finalizarCadastro}
          onVoltar={() => setTela('login')} 
        />
      ) : (
        <Dashboard pedidos={pedidos} emitirNota={emitirNota} />
      )}
    </SafeAreaView>
  );
}