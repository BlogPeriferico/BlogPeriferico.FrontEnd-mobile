import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";
import { styles } from "../styles/components/CardClimaStyles";
import { zonasClima } from "../data/zonasClima";
import { Ionicons } from "@expo/vector-icons";

const API_KEY = "56fd2180ff9c0389b8ebc9c566b4d563";

const zonas = Object.entries(zonasClima).map(([nome, dados]) => ({
  nome: `São Paulo, ${nome}`, 
  bairro: dados.bairro,
  lat: dados.lat,
  lon: dados.lon,
  imagem: `https://blogperiferico.blob.core.windows.net/zonas/zona_${nome.toLowerCase()}.png`,
}));

export default function CardClima() {
  const [indice, setIndice] = useState(0);
  const [clima, setClima] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const zonaAtual = zonas[indice];

  useEffect(() => {
    let cancelado = false;
    (async () => {
      setCarregando(true);
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${zonaAtual.lat}&lon=${zonaAtual.lon}&appid=${API_KEY}&units=metric&lang=pt_br`
        );
        if (!cancelado) setClima(res.data);
      } catch (e) {
        if (!cancelado) setClima(null);
        console.error("Erro ao buscar clima:", e?.message || e);
      } finally {
        if (!cancelado) setCarregando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [indice, zonaAtual.lat, zonaAtual.lon]);

  const proximo = () => setIndice((p) => (p + 1) % zonas.length);
  const anterior = () => setIndice((p) => (p - 1 + zonas.length) % zonas.length);

  const formatarData = (timestamp) => {
    const d = new Date(timestamp * 1000);
    const weekday = d
      .toLocaleDateString("pt-BR", { weekday: "long" })
      .replace(/^\w/, (c) => c.toUpperCase()); 
    const data = d.toLocaleDateString("pt-BR");
    return { weekday, data };
  };

  const info = clima ? formatarData(clima.dt) : null;

  return (
    <View style={styles.card}>
      <Image source={{ uri: zonaAtual.imagem }} style={styles.imagem} />

      <View style={styles.dim} />

      <View style={styles.localTop}>
        <Ionicons name="location-outline" size={20} color="#EAF6FF" style={{ marginRight: 6 }} />
        <Text style={styles.localizacao}>{zonaAtual.nome}</Text>
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      ) : clima ? (
        <View style={styles.centerContent}>
          <Image
            source={{ uri: `https://openweathermap.org/img/wn/${clima.weather?.[0]?.icon || "01d"}@2x.png` }}
            style={styles.icone}
          />
          <Text style={styles.temp}>{Math.round(clima.main?.temp ?? 0)} °C</Text>
          <Text style={styles.weekday}>{info.weekday}</Text>
          <Text style={styles.date}>{info.data}</Text>
        </View>
      ) : (
        <Text style={styles.erro}>Erro ao carregar clima</Text>
      )}

      <TouchableOpacity style={[styles.navBtn, styles.esquerda]} onPress={anterior} activeOpacity={0.8}>
        <Ionicons name="chevron-back" size={28} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.navBtn, styles.direita]} onPress={proximo} activeOpacity={0.8}>
        <Ionicons name="chevron-forward" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}