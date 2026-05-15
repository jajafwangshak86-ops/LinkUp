;; Clarity version: 3 (post-Nakamoto)
;; linkup-posts.clar
;; On-chain posts, likes, and STX tips for LinkUp.
;; Content hash (SHA-256 of post JSON) is stored on-chain for integrity.
;; Full content lives in Gaia (user-controlled decentralized storage).

(define-constant ERR-NOT-FOUND       (err u200))
(define-constant ERR-ALREADY-LIKED   (err u201))
(define-constant ERR-ZERO-TIP        (err u202))
(define-constant ERR-SELF-TIP        (err u203))
(define-constant ERR-NOT-AUTHOR      (err u204))
(define-constant ERR-CONTENT-EMPTY   (err u205))
(define-constant ERR-OVERFLOW        (err u206))

(define-constant MAX-UINT u340282366920938463463374607431768211455)

;; --- Storage -----------------------------------------------------------------

(define-map posts
  { post-id: uint }
  {
    author:       principal,
    content-hash: (buff 32),
    gaia-url:     (string-utf8 256),
    likes:        uint,
    tips-total:   uint,
    created-at:   uint,
    deleted:      bool,
  }
)

(define-map likes
  { post-id: uint, liker: principal }
  { liked: bool }
)

(define-data-var next-post-id uint u1)

;; --- Public functions ---------------------------------------------------------

(define-public (create-post
    (content-hash (buff 32))
    (gaia-url (string-utf8 256)))
  (let ((post-id (var-get next-post-id)))
    (asserts! (> (len gaia-url) u0) ERR-CONTENT-EMPTY)
    (asserts! (< post-id MAX-UINT) ERR-OVERFLOW)
    ;; Only registered users can post
    (asserts! (contract-call? .linkup-factory is-registered tx-sender) ERR-NOT-FOUND)
    (map-set posts { post-id: post-id }
      {
        author:       tx-sender,
        content-hash: content-hash,
        gaia-url:     gaia-url,
        likes:        u0,
        tips-total:   u0,
        created-at:   stacks-block-height,
        deleted:      false,
      }
    )
    (var-set next-post-id (+ post-id u1))
    ;; Notify factory to increment post count
    (try! (contract-call? .linkup-factory increment-post-count tx-sender))
    (ok post-id)
  )
)

(define-public (like-post (post-id uint))
  (let ((post (unwrap! (map-get? posts { post-id: post-id }) ERR-NOT-FOUND)))
    (asserts! (not (get deleted post)) ERR-NOT-FOUND)
    (asserts!
      (is-none (map-get? likes { post-id: post-id, liker: tx-sender }))
      ERR-ALREADY-LIKED
    )
    (map-set likes { post-id: post-id, liker: tx-sender } { liked: true })
    (map-set posts { post-id: post-id }
      (merge post { likes: (+ (get likes post) u1) })
    )
    (ok true)
  )
)

(define-public (tip-post (post-id uint) (amount uint))
  (let ((post (unwrap! (map-get? posts { post-id: post-id }) ERR-NOT-FOUND)))
    (asserts! (not (get deleted post)) ERR-NOT-FOUND)
    (asserts! (> amount u0) ERR-ZERO-TIP)
    (asserts! (not (is-eq tx-sender (get author post))) ERR-SELF-TIP)
    (asserts! (<= amount (- MAX-UINT (get tips-total post))) ERR-OVERFLOW)
    (try! (stx-transfer? amount tx-sender (get author post)))
    (map-set posts { post-id: post-id }
      (merge post { tips-total: (+ (get tips-total post) amount) })
    )
    ;; Notify factory to increment tip count for author
    (try! (contract-call? .linkup-factory increment-tip-count (get author post)))
    (ok true)
  )
)

(define-public (delete-post (post-id uint))
  (let ((post (unwrap! (map-get? posts { post-id: post-id }) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender (get author post)) ERR-NOT-AUTHOR)
    (map-set posts { post-id: post-id } (merge post { deleted: true }))
    (ok true)
  )
)

;; --- Read-only ----------------------------------------------------------------

(define-read-only (get-post (post-id uint))
  (map-get? posts { post-id: post-id })
)

(define-read-only (has-liked (post-id uint) (user principal))
  (is-some (map-get? likes { post-id: post-id, liker: user }))
)

(define-read-only (get-next-post-id)
  (var-get next-post-id)
)

;; Error code reference:
;; u200 - ERR-NOT-FOUND: post does not exist or is deleted
;; u201 - ERR-ALREADY-LIKED: caller already liked this post
;; u202 - ERR-ZERO-TIP: tip amount must be > 0
;; u203 - ERR-SELF-TIP: cannot tip your own post
;; u204 - ERR-NOT-AUTHOR: only the author can delete
;; u205 - ERR-CONTENT-EMPTY: gaia-url must not be empty
;; u206 - ERR-OVERFLOW: arithmetic overflow guard
