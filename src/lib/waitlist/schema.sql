-- Waitlist entries.
--
-- Position is assigned by the sequence and never renumbered: a signup's place in line is
-- fixed the moment it is created, and a referral promotion moves someone into the Founding
-- 500 without changing anyone else's number.

CREATE TABLE IF NOT EXISTS waitlist_entry (
  position            INTEGER      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email               TEXT         NOT NULL,
  referral_code       TEXT         NOT NULL,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
  confirmed_referrals INTEGER      NOT NULL DEFAULT 0,
  -- Set true on insert for the first N positions, and again on the third confirmed referral.
  founding            BOOLEAN      NOT NULL DEFAULT FALSE
);

-- One place per address. Signing up twice returns the original position.
CREATE UNIQUE INDEX IF NOT EXISTS waitlist_entry_email_key
  ON waitlist_entry (lower(email));

CREATE UNIQUE INDEX IF NOT EXISTS waitlist_entry_referral_code_key
  ON waitlist_entry (referral_code);
