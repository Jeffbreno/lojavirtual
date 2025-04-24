export const getOrderStatusInfo = (status) => {
    const statusMap = {
      N: { label: "Novo", color: "secondary", icon: "🆕" },
      P: { label: "Processando", color: "info", icon: "🔄" },
      PA: { label: "Pago", color: "primary", icon: "💳" },
      S: { label: "Enviado", color: "warning", icon: "📦" },
      D: { label: "Entregue", color: "success", icon: "✅" },
      F: { label: "Finalizado", color: "success", icon: "🏁" },
      R: { label: "Devolvido", color: "danger", icon: "↩️" },
      RF: { label: "Reembolsado", color: "dark", icon: "💸" },
      C: { label: "Cancelado", color: "danger", icon: "❌" },
    };
    return statusMap[status] || { label: status, color: "light", icon: "❔" };
  };
  