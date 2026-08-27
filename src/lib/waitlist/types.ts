/**
 * The waitlist is one of only three writes on the site (the others are the bag and
 * checkout). Everything behind this interface is swappable — the pages never see storage.
 */

/**
 * What someone told us when they joined.
 *
 * Both are optional, and permanently so. The list was opened with an email-only form and
 * those entries are as valid as any other; the held list outside this database has no rows
 * here at all. A required field would be a lie about data that does not exist.
 */
export interface SignupDetails {
  /** First name. The Founding 500 promises "your name in the first box insert", which is
   *  not a promise the site could keep while it collected only an address. */
  name?: string;
  /** Which product they came for. Cycle Ritual has no SKU, so this is the only measure of
   *  whether to make it. A product id from the catalogue, or "both". */
  productInterest?: string;
}

export interface WaitlistEntry extends SignupDetails {
  email: string;
  /** 1-based. Set the moment the entry is created and never renumbered. */
  position: number;
  /** Issued per entry. Three confirmed referrals promote the entry to Founding 500. */
  referralCode: string;
  createdAt: string;
  confirmedReferrals: number;
  /** True once inside the first 500, or once promoted by referrals. */
  founding: boolean;
  /** Set when they opt out. The entry and its place survive; the email stops. */
  unsubscribedAt?: string | null;
}

export interface SignupResult {
  entry: WaitlistEntry;
  /** False when the email was already on the list — the position is the original one. */
  created: boolean;
}

export interface WaitlistStore {
  /** Total signups. Drives the Founding 500 progress card. */
  count(): Promise<number>;
  signup(email: string, referredBy?: string, details?: SignupDetails): Promise<SignupResult>;
  findByEmail(email: string): Promise<WaitlistEntry | null>;
  /** Idempotent: unsubscribing twice is not an error, and an unknown address is not either. */
  unsubscribe(email: string): Promise<void>;
}
