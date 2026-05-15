;; linkup-custody.clar
;; Non-custodial STX transfer with daily spending guard.
;; Users hold their own keys via Hiro Wallet.

(define-constant ERR-DAILY-LIMIT-EXCEEDED (err u100))
(define-constant ERR-ZERO-AMOUNT (err u101))
(define-constant ERR-SELF-TRANSFER (err u102))

(define-constant DAILY-LIMIT-USTX u1000000000) ;; 1000 STX in micro-STX

;; Track daily spend per principal: { user → { day → total-spent } }
(define-map daily-spend
  { user: principal, day: uint }
  { total: uint }
)

;; Fix 1: use stacks-block-height (Clarity 3 / post-Nakamoto)
(define-private (current-day)
  (/ stacks-block-height u144)
)

(define-private (get-spent (user principal))
  (default-to u0
    (get total (map-get? daily-spend { user: user, day: (current-day) }))
  )
)

(define-private (record-spend (user principal) (amount uint))
  (map-set daily-spend
    { user: user, day: (current-day) }
    { total: (+ (get-spent user) amount) }
  )
)

;; send-stx: transfer STX with daily limit enforcement
(define-public (send-stx (recipient principal) (amount uint))
  (let ((spent (get-spent tx-sender)))
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (asserts! (not (is-eq tx-sender recipient)) ERR-SELF-TRANSFER)
    ;; Fix 3: guard against overflow — if amount alone exceeds the limit, reject early
    (asserts! (<= amount DAILY-LIMIT-USTX) ERR-DAILY-LIMIT-EXCEEDED)
    (asserts! (<= (+ spent amount) DAILY-LIMIT-USTX) ERR-DAILY-LIMIT-EXCEEDED)
    ;; Fix 2: transfer first, record spend only on success
    (try! (stx-transfer? amount tx-sender recipient))
    (record-spend tx-sender amount)
    (ok true)
  )
)

;; Read-only: check remaining daily allowance for a user
(define-read-only (remaining-allowance (user principal))
  (let ((spent (get-spent user)))
    (if (>= spent DAILY-LIMIT-USTX)
      u0
      (- DAILY-LIMIT-USTX spent)
    )
  )
)
