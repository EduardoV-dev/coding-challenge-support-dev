export async function sendEmailNotification(
  ticketId: string,
  companyId: string,
) {
  return new Promise((resolve) => {
    console.log(
      `Enviando notificación urgente de ${companyId} para el ticket ${ticketId}...`,
    );
    resolve(true);
  });
}
