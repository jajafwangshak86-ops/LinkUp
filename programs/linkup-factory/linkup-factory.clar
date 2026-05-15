;; Clarity version: 3 (post-Nakamoto)
;; linkup-factory.clar
;;
;; Factory + registry for LinkUp.
;; Tracks every registered user, their deployed profile, and their post count.
;; Acts as the single entry point - the mobile app only needs this one address.
;;
;; Architecture:
;;   linkup-factory   <- this contract (registry + routing)
;;   linkup-custody   <- STX transfer guard (one global instance)
;;   linkup-posts     <- post registry (one global instance)
;;
;; The factory does NOT deploy new contract instances (Clarity does not support
;; dynamic contract deployment). Instead it acts as:
;;   1. User registry   - maps wallet address -> username + profile metadata
;;   2. Authorization   - only registered users can create posts / send tips
;;   3. Router          - single address the frontend resolves for all contract calls

(define-constant ERR-ALREADY-REGISTERED (err u300))
(define-constant ERR-NOT-REGISTERED     (err u301))
(define-constant ERR-USERNAME-TAKEN     (err u302))
(define-constant ERR-USERNAME-EMPTY     (err u303))
(define-constant ERR-NOT-OWNER          (err u304))
(define-constant ERR-OVERFLOW           (err u305))

(define-constant CONTRACT-OWNER tx-sender)
(define-constant MAX-UINT u340282366920938463463374607431768211455)

;; --- Storage -----------------------------------------------------------------

;; principal -> user profile
(define-map users
  { address: principal }
  {
    username:    (string-utf8 50),
    gaia-url:    (string-utf8 256), ;; Gaia URL for full profile JSON
    post-count:  uint,
    tip-count:   uint,
    registered-at: uint,            ;; block height
    active:      bool,
  }
)

;; username -> principal (for uniqueness check + lookup by username)
(define-map usernames
  { username: (string-utf8 50) }
  { address: principal }
)

;; global stats
(define-data-var total-users uint u0)
(define-data-var total-posts uint u0)
(define-data-var total-tips  uint u0)

;; --- User registration --------------------------------------------------------

(define-public (register
    (username (string-utf8 50))
    (gaia-url (string-utf8 256)))
  (begin
    (asserts! (> (len username) u0) ERR-USERNAME-EMPTY)
    (asserts! (is-none (map-get? users { address: tx-sender })) ERR-ALREADY-REGISTERED)
    (asserts! (is-none (map-get? usernames { username: username })) ERR-USERNAME-TAKEN)
    (asserts! (< (var-get total-users) MAX-UINT) ERR-OVERFLOW)
    (map-set users { address: tx-sender }
      {
        username:      username,
        gaia-url:      gaia-url,
        post-count:    u0,
        tip-count:     u0,
        registered-at: stacks-block-height,
        active:        true,
      }
    )
    (map-set usernames { username: username } { address: tx-sender })
    (var-set total-users (+ (var-get total-users) u1))
    (ok tx-sender)
  )
)

;; Update profile Gaia URL
(define-public (update-profile (gaia-url (string-utf8 256)))
  (let ((user (unwrap! (map-get? users { address: tx-sender }) ERR-NOT-REGISTERED)))
    (map-set users { address: tx-sender }
      (merge user { gaia-url: gaia-url })
    )
    (ok true)
  )
)

;; --- Called by linkup-posts contract to increment post count -----------------

(define-public (increment-post-count (author principal))
  (let ((user (unwrap! (map-get? users { address: author }) ERR-NOT-REGISTERED)))
    ;; Only the linkup-posts contract can call this
    (asserts! (is-eq contract-caller .linkup-posts) ERR-NOT-OWNER)
    (asserts! (< (get post-count user) MAX-UINT) ERR-OVERFLOW)
    (map-set users { address: author }
      (merge user { post-count: (+ (get post-count user) u1) })
    )
    (var-set total-posts (+ (var-get total-posts) u1))
    (ok true)
  )
)

;; Called by linkup-posts when a tip is sent
(define-public (increment-tip-count (author principal))
  (let ((user (unwrap! (map-get? users { address: author }) ERR-NOT-REGISTERED)))
    (asserts! (is-eq contract-caller .linkup-posts) ERR-NOT-OWNER)
    (asserts! (< (get tip-count user) MAX-UINT) ERR-OVERFLOW)
    (map-set users { address: author }
      (merge user { tip-count: (+ (get tip-count user) u1) })
    )
    (var-set total-tips (+ (var-get total-tips) u1))
    (ok true)
  )
)

;; --- Read-only ----------------------------------------------------------------

(define-read-only (get-user (address principal))
  (map-get? users { address: address })
)

(define-read-only (get-address-by-username (username (string-utf8 50)))
  (map-get? usernames { username: username })
)

(define-read-only (is-registered (address principal))
  (is-some (map-get? users { address: address }))
)

(define-read-only (get-stats)
  {
    total-users: (var-get total-users),
    total-posts: (var-get total-posts),
    total-tips:  (var-get total-tips),
  }
)

;; Error code reference:
;; u300 - ERR-ALREADY-REGISTERED: address already has a profile
;; u301 - ERR-NOT-REGISTERED: address has no profile
;; u302 - ERR-USERNAME-TAKEN: username already claimed
;; u303 - ERR-USERNAME-EMPTY: username must not be empty
;; u304 - ERR-NOT-OWNER: caller is not the authorized contract
;; u305 - ERR-OVERFLOW: arithmetic overflow guard
