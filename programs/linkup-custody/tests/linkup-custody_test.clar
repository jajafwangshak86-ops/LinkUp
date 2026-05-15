;; linkup-custody unit tests (Clarinet)

(define-public (test-send-stx-success)
  (begin
    (try! (contract-call? .linkup-custody send-stx 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM u1000000))
    (ok true)
  )
)

(define-public (test-send-stx-zero-amount-fails)
  (match (contract-call? .linkup-custody send-stx 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM u0)
    ok-val (err u999) ;; should not succeed
    err-val (ok true)
  )
)

(define-public (test-remaining-allowance-full-when-no-spend)
  (let ((allowance (contract-call? .linkup-custody remaining-allowance tx-sender)))
    (asserts! (is-eq allowance u1000000000) (err u998))
    (ok true)
  )
)
