import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class WhatsappService {
 private readonly logger = new Logger(WhatsappService.name);
 private readonly instanceId = process.env.ULTRAMSG_INSTANCE_ID;
 private readonly token = process.env.ULTRAMSG_TOKEN;

 async enviarMensaje(celular: string, mensaje: string): Promise<void> {
    if (!this.instanceId || !this.token) {
        this.logger.warn('ULTRAMSG_INSTANCE_ID o ULTRAMSG_TOKEN no configurados');
        return;
    }

    const formattedCelular = this.formatearNumeroCelular(celular);
    const url = `https://api.ultramsg.com/${this.instanceId}/messages/chat`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                token: this.token,
                to: formattedCelular,
                body: mensaje,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            this.logger.error(`Error al enviar mensaje: ${response.status} - ${errorBody}`);
        }
    } catch (error) {
        this.logger.error(`Error al enviar mensaje: ${error}`);
        }
    }
    private formatearNumeroCelular(celularLocal: string): string {
    const soloDigitos = celularLocal.replace(/\D/g, '');
    return `521${soloDigitos}`;
  }
}