export interface OutboundEmail {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** List-Unsubscribe target. Required by Gmail and Yahoo for bulk senders. */
  unsubscribeUrl?: string;
}

export interface SendResult {
  sent: boolean;
  /** The provider's id for the message, when it accepted one. */
  id?: string;
  reason?: string;
}

export interface Mailer {
  /** False when no provider is configured — callers use this to stay honest in the UI. */
  readonly configured: boolean;
  send(message: OutboundEmail): Promise<SendResult>;
}
