;; Clarity version: 3 (post-Nakamoto)
;; linkup-custody.clar
;; Non-custodial STX transfer with daily spending guard.
;; Users hold their own keys via Hiro Wallet.

(define-constant ERR-DAILY-LIMIT-EXCEEDED (err u100))
(define-constant ERR-ZERO-AMOUNT          (err u101))
(define-constant ERR-SELF-TRANSFER        (err u102))

(define-constant DAILY-LIMIT-USTX u1000000000) ;; 1000 STX in micro-STX

;; Track daily spend per principal - value is plain uint (micro-STX spent)
(define-map daily-spend
  { user: principal, day: uint }
  uint
)

(define-private (current-day)
  (/ stacks-block-height u144) ;; ~144 blocks per day (10-min Bitcoin blocks)
)

(define-private (get-spent-on-day (user principal) (day uint))
  (default-to u0 (map-get? daily-spend { user: user, day: day }))
)

(define-private (record-spend (user principal) (day uint) (new-total uint))
  (map-set daily-spend { user: user, day: day } new-total)
)

;; send-stx: transfer STX with daily limit enforcement
(define-public (send-stx (recipient principal) (amount uint))
  (let (
    (day   (current-day))
    (spent (get-spent-on-day tx-sender (current-day)))
  )
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (asserts! (not (is-eq tx-sender recipient)) ERR-SELF-TRANSFER)
    (asserts! (<= amount DAILY-LIMIT-USTX) ERR-DAILY-LIMIT-EXCEEDED)
    (asserts! (<= (+ spent amount) DAILY-LIMIT-USTX) ERR-DAILY-LIMIT-EXCEEDED)
    (try! (stx-transfer? amount tx-sender recipient))
    (record-spend tx-sender day (+ spent amount))
    (ok true)
  )
)

;; Read-only: check remaining daily allowance for a user
(define-read-only (remaining-allowance (user principal))
  (let ((spent (get-spent-on-day user (current-day))))
    (if (>= spent DAILY-LIMIT-USTX)
      u0
      (- DAILY-LIMIT-USTX spent)
    )
  )
)

;; Error code reference:
;; u100 - ERR-DAILY-LIMIT-EXCEEDED: user has spent >= 1000 STX today
;; u101 - ERR-ZERO-AMOUNT: transfer amount must be > 0
;; u102 - ERR-SELF-TRANSFER: sender and recipient must differ
