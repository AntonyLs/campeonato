import { Injectable, Logger } from '@nestjs/common';

interface DelegateContinuationEmailData {
  to: string;
  delegateName: string;
  teamName: string;
  link: string;
  expiresAt: Date | null;
}

@Injectable()
export class ResendMailService {
  private readonly logger = new Logger(ResendMailService.name);
  private readonly apiKey = process.env.RESEND_API_KEY;
  private readonly fromEmail =
    process.env.RESEND_FROM_EMAIL ?? 'Campeonato <onboarding@resend.dev>';

  async sendDelegateContinuationEmail(data: DelegateContinuationEmailData) {
    if (!this.apiKey) {
      this.logger.warn(
        'No se envio correo porque RESEND_API_KEY no esta configurada.',
      );

      return {
        sent: false,
        provider: 'resend',
        message:
          'No se envio el correo porque RESEND_API_KEY no esta configurada.',
      };
    }

    const html = this.buildDelegateContinuationHtml(data);
    const text = this.buildDelegateContinuationText(data);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.fromEmail,
        to: [data.to],
        subject: `Continua la inscripcion de tu equipo ${data.teamName}`,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      this.logger.error(
        `Resend devolvio ${response.status}: ${errorText || 'sin detalle'}`,
      );

      return {
        sent: false,
        provider: 'resend',
        message: 'No se pudo enviar el correo de continuidad.',
        detail: errorText,
      };
    }

    const payload = (await response.json()) as { id?: string };

    return {
      sent: true,
      provider: 'resend',
      emailId: payload.id ?? null,
      message: 'Correo enviado correctamente.',
    };
  }

  private buildDelegateContinuationHtml(data: DelegateContinuationEmailData) {
    const expiresAt = data.expiresAt
      ? data.expiresAt.toLocaleString('es-PE')
      : 'sin fecha de vencimiento';

    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
        <h2>Continua la inscripcion de tu equipo</h2>
        <p>Hola ${data.delegateName},</p>
        <p>Tu equipo <strong>${data.teamName}</strong> ya fue registrado.</p>
        <p>Usa este enlace para continuar completando la lista de jugadores:</p>
        <p>
          <a href="${data.link}" style="display:inline-block;padding:12px 18px;background:#111827;color:#ffffff;text-decoration:none;border-radius:6px;">
            Continuar inscripcion
          </a>
        </p>
        <p>Si el boton no funciona, copia y pega este enlace en tu navegador:</p>
        <p>${data.link}</p>
        <p>Vencimiento del enlace: ${expiresAt}</p>
      </div>
    `.trim();
  }

  private buildDelegateContinuationText(data: DelegateContinuationEmailData) {
    const expiresAt = data.expiresAt
      ? data.expiresAt.toLocaleString('es-PE')
      : 'sin fecha de vencimiento';

    return [
      `Hola ${data.delegateName},`,
      '',
      `Tu equipo ${data.teamName} ya fue registrado.`,
      'Usa este enlace para continuar completando la lista de jugadores:',
      data.link,
      '',
      `Vencimiento del enlace: ${expiresAt}`,
    ].join('\n');
  }
}
