/**
 * Hosted KYC provider adapter contract only. This is not a vendor integration.
 * Do not accept document uploads or save raw provider payloads in the app.
 */
export type HostedKycStatus =
  | "PENDING"
  | "NEEDS_REVIEW"
  | "VERIFIED"
  | "REJECTED"
  | "EXPIRED";

export interface HostedSession {
  url: string;
  expiresAt: Date;
}

export interface VerifiedKycWebhook {
  providerReference: string;
  status: HostedKycStatus;
  occurredAt: Date;
  eventId: string;
}

export interface KycProvider {
  /** Creates a short-lived provider-hosted session for an existing account. */
  createHostedSession(input: {
    internalUserId: string;
    returnUrl: string;
    idempotencyKey: string;
  }): Promise<HostedSession>;

  /** Verify signature, timestamp, and replay/idempotency before returning normalized data. */
  verifyWebhook(input: {
    rawBody: Uint8Array;
    signatureHeader: string | undefined;
  }): Promise<VerifiedKycWebhook>;
}

// Implement only after provider selection, contract, privacy review, and secure secret configuration.
