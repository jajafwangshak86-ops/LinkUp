;; Clarity version: 3 (post-Nakamoto)
;; linkup-factory.clar - user registry, authorization hub

(define-constant ERR-ALREADY-REGISTERED (err u300))
(define-constant ERR-NOT-REGISTERED     (err u301))
(define-constant ERR-USERNAME-TAKEN     (err u302))
(define-constant ERR-USERNAME-EMPTY     (err u303))
(define-constant ERR-NOT-OWNER          (err u304))
(define-constant ERR-OVERFLOW           (err u305))

(define-constant MAX-UINT u340282366920938463463374607431768211455)

;; principal -> user profile (key is plain principal)
(define-map users
  principal
  {
    username:      (string-utf8 50),
    gaia-url:      (string-utf8 256),
    post-count:    uint,
    tip-count:     uint,
    registered-at: uint,
    active:        bool,
  }
)

;; username -> principal (key is plain string-utf8, value is plain principal)
(define-map usernames
  (string-utf8 50)
  principal
)

(define-data-var total-users uint u0)
(define-data-var total-posts uint u0)
(define-data-var total-tips  uint u0)

(define-public (register
    (username (string-utf8 50))
    (gaia-url (string-utf8 256)))
  (begin
    (asserts! (> (len username) u0) ERR-USERNAME-EMPTY)
    (asserts! (is-none (map-get? users tx-sender)) ERR-ALREADY-REGISTERED)
    (asserts! (is-none (map-get? usernames username)) ERR-USERNAME-TAKEN)
    (asserts! (< (var-get total-users) MAX-UINT) ERR-OVERFLOW)
    (map-set users tx-sender
      {
        username:      username,
        gaia-url:      gaia-url,
        post-count:    u0,
        tip-count:     u0,
        registered-at: stacks-block-height,
        active:        true,
      }
    )
    (map-set usernames username tx-sender)
    (var-set total-users (+ (var-get total-users) u1))
    (ok tx-sender)
  )
)

(define-public (update-profile (gaia-url (string-utf8 256)))
  (let ((user (unwrap! (map-get? users tx-sender) ERR-NOT-REGISTERED)))
    (map-set users tx-sender (merge user { gaia-url: gaia-url }))
    (ok true)
  )
)

(define-public (increment-post-count (author principal))
  (let ((user (unwrap! (map-get? users author) ERR-NOT-REGISTERED)))
    (asserts! (is-eq contract-caller .linkup-posts) ERR-NOT-OWNER)
    (asserts! (< (get post-count user) MAX-UINT) ERR-OVERFLOW)
    (map-set users author (merge user { post-count: (+ (get post-count user) u1) }))
    (var-set total-posts (+ (var-get total-posts) u1))
    (ok true)
  )
)

(define-public (increment-tip-count (author principal))
  (let ((user (unwrap! (map-get? users author) ERR-NOT-REGISTERED)))
    (asserts! (is-eq contract-caller .linkup-posts) ERR-NOT-OWNER)
    (asserts! (< (get tip-count user) MAX-UINT) ERR-OVERFLOW)
    (map-set users author (merge user { tip-count: (+ (get tip-count user) u1) }))
    (var-set total-tips (+ (var-get total-tips) u1))
    (ok true)
  )
)

(define-read-only (get-user (address principal))
  (map-get? users address)
)

(define-read-only (get-address-by-username (username (string-utf8 50)))
  (map-get? usernames username)
)

(define-read-only (is-registered (address principal))
  (is-some (map-get? users address))
)

(define-read-only (get-stats)
  {
    total-users: (var-get total-users),
    total-posts: (var-get total-posts),
    total-tips:  (var-get total-tips),
  }
)

;; u300 - ALREADY-REGISTERED  u301 - NOT-REGISTERED  u302 - USERNAME-TAKEN
;; u303 - USERNAME-EMPTY       u304 - NOT-OWNER        u305 - OVERFLOW
