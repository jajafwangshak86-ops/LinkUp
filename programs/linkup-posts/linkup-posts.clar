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

;; ─── Storage ─────────────────────────────────────────────────────────────────

;; Post registry: post-id → post metadata
(define-map posts
  { post-id: uint }
  {
    author:       principal,
    content-hash: (buff 32),   ;; SHA-256 of full post JSON stored in Gaia
    gaia-url:     (string-utf8 256), ;; Gaia URL where full content lives
    likes:        uint,
    tips-total:   uint,        ;; total micro-STX tipped
    created-at:   uint,        ;; block height
    deleted:      bool,
  }
)

;; Like registry: prevent double-likes
(define-map likes
  { post-id: uint, liker: principal }
  { liked: bool }
)

;; Auto-increment post ID
(define-data-var next-post-id uint u1)

;; ─── Public functions ─────────────────────────────────────────────────────────

;; create-post: register a post on-chain (content stored in Gaia)
(define-public (create-post
    (content-hash (buff 32))
    (gaia-url (string-utf8 256)))
  (let ((post-id (var-get next-post-id)))
    (asserts! (> (len gaia-url) u0) ERR-CONTENT-EMPTY)
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
    (ok post-id)
  )
)

;; like-post: like a post (one like per principal per post)
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

;; tip-post: send STX tip to post author
(define-public (tip-post (post-id uint) (amount uint))
  (let ((post (unwrap! (map-get? posts { post-id: post-id }) ERR-NOT-FOUND)))
    (asserts! (not (get deleted post)) ERR-NOT-FOUND)
    (asserts! (> amount u0) ERR-ZERO-TIP)
    (asserts! (not (is-eq tx-sender (get author post))) ERR-SELF-TIP)
    (try! (stx-transfer? amount tx-sender (get author post)))
    (map-set posts { post-id: post-id }
      (merge post { tips-total: (+ (get tips-total post) amount) })
    )
    (ok true)
  )
)

;; delete-post: author can soft-delete their post
(define-public (delete-post (post-id uint))
  (let ((post (unwrap! (map-get? posts { post-id: post-id }) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender (get author post)) ERR-NOT-AUTHOR)
    (map-set posts { post-id: post-id } (merge post { deleted: true }))
    (ok true)
  )
)

;; ─── Read-only ────────────────────────────────────────────────────────────────

(define-read-only (get-post (post-id uint))
  (map-get? posts { post-id: post-id })
)

(define-read-only (has-liked (post-id uint) (user principal))
  (is-some (map-get? likes { post-id: post-id, liker: user }))
)

(define-read-only (get-next-post-id)
  (var-get next-post-id)
)
