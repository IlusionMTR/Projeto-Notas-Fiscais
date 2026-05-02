import React, { useState, useEffect } from 'react';
import { SafeAreaView, Alert, Platform } from 'react-native';
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

  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [pedidos, setPedidos] = useState([]);

  const carregarPedidos = async () => {
    try {
      const response = await fetch(`${API_URL}/vendas-teste`);
      const data = await response.json();
      if (response.ok) {
        setPedidos(data);
      }
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    }
  };

  useEffect(() => {
    if (tela === 'dashboard') {
      carregarPedidos();
    }
  }, [tela]);

  const exibirAlerta = (titulo, mensagem) => {
    if (Platform.OS === 'web') {
      alert(`${titulo}: ${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  const login = async () => {
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
        setUsuarioLogado(data.usuario);
        setTela('dashboard');
        setUsuario('');
        setSenha('');
      } else {
        exibirAlerta('Erro', data.erro || 'Usuário ou senha incorretos');
      }
    } catch (error) {
      exibirAlerta('Erro de Conexão', 'Certifique-se que o backend está rodando.');
    }
  };

  const finalizarCadastro = async () => {
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

      if (response.ok) {
        exibirAlerta('Sucesso', 'Cadastro realizado!');
        setTela('login');
      } else {
        const data = await response.json();
        exibirAlerta('Erro', data.erro || 'Erro ao cadastrar.');
      }
    } catch (error) {
      exibirAlerta('Erro de Conexão', 'Não foi possível conectar ao servidor.');
    }
  };

  const atualizarUsuario = async (id, dados) => {
    try {
      const response = await fetch(`${API_URL}/usuario/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      if (response.ok) {
        exibirAlerta('Sucesso', 'Dados atualizados! Por favor, entre novamente.');
        setUsuarioLogado(null);
        setTela('login');
      } else {
        exibirAlerta('Erro', 'Falha ao atualizar dados.');
      }
    } catch (error) {
      exibirAlerta('Erro de Conexão', 'Erro ao tentar atualizar o perfil.');
    }
  };

  // NOVA FUNÇÃO: DELETAR USUÁRIO
  const deletarUsuario = async (id) => {
    try {
      const response = await fetch(`${API_URL}/usuario/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        exibirAlerta('Conta Removida', 'Sua conta foi excluída com sucesso.');
        setUsuarioLogado(null);
        setTela('login');
      } else {
        exibirAlerta('Erro', 'Não foi possível excluir a conta.');
      }
    } catch (error) {
      exibirAlerta('Erro de Conexão', 'Erro ao tentar deletar a conta.');
    }
  };

  const logout = () => {
    setUsuarioLogado(null);
    setTela('login');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {tela === 'login' ? (
        <Login 
          usuario={usuario} setUsuario={setUsuario} 
          senha={senha} setSenha={setSenha} 
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
        <Dashboard 
          pedidos={pedidos} 
          usuarioLogado={usuarioLogado} 
          onLogout={logout}
          onAtualizar={atualizarUsuario}
          onDeletar={deletarUsuario} // Passando a nova função
        />
      )}
    </SafeAreaView>
  );
}