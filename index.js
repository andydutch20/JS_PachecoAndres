// Iniciar al cargar el script (sin DOMContentLoaded)
mostrarClima("Guadalajara,MX");

async function mostrarClima(ciudad) {
  const apiKey = "0c59e81343968dc9bdf7a55a6b7b8212"; // Reemplaza con tu API key real
  const weatherDiv = document.getElementById("weather");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();

    const { temp } = data.main;
    const descripcion = data.weather[0].description.toLowerCase();
    const icono = data.weather[0].icon;
    const ciudadNombre = data.name;
    const paisCodigo = data.sys.country;

    // Recomendación según el clima
    let recomendacion = "";

    if (descripcion.includes("lluvia") || descripcion.includes("tormenta")) {
      recomendacion = "🌧️ No es buen día para salir en bici, está lloviendo.";
    } else if (descripcion.includes("nieve")) {
      recomendacion = "❄️ Clima con nieve, mejor quedarse en casa.";
    } else if (descripcion.includes("nublado")) {
      recomendacion = "☁️ Está nublado, pero puedes salir con precaución en bici.";
    } else if (descripcion.includes("soleado") || descripcion.includes("despejado")) {
      recomendacion = "☀️ ¡Buen clima para salir en bicicleta!";
    } else {
      recomendacion = "🌤️ Clima moderado, sal con precaución en bici.";
    }

    // Mostrar clima y recomendacións
    weatherDiv.innerHTML = `
      <p><strong>${ciudadNombre}, Jalisco, México</strong></p>
      <p>${temp.toFixed(1)}°C - ${descripcion}</p>
      <img src="https://openweathermap.org/img/wn/${icono}@2x.png" alt="${descripcion}">
      <p>${recomendacion}</p>
    `;
  } catch (error) {
    console.error("Error al obtener el clima:", error);
    weatherDiv.textContent = "No se pudo cargar el clima.";
  }
}
