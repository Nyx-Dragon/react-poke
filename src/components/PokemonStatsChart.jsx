import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// Función para abreviar nombres largos de estadísticas
const shorten = (statName) => {
  switch (statName) {
    case "special-attack": return "S.Atk";
    case "special-defense": return "S.Def";
    case "hp": return "HP";
    case "attack": return "Atk";
    case "defense": return "Def";
    case "speed": return "SP";
    default: return statName;
  }
};

// Función para asignar color según valor
const getColor = (value) => {
  if (value < 50) return "#e63946";       // Rojo: bajo
  if (value < 80) return "#f4a261";       // Naranja/amarillo: medio
  if (value < 120) return "#2a9d8f";      // Verde: alto
  return "#457b9d";                       // Azul: muy alto
};

const PokemonStatsChart = ({ pokemon }) => {
  const data = pokemon.stats.map((s) => ({
    name: shorten(s.stat.name),
    value: s.base_stat,
  }));

  return (
    <div className="chart-wrapper">
      <h4>Estadísticas base</h4>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell key={index} fill={getColor(entry.value)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PokemonStatsChart;
