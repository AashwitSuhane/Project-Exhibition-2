import React, { useState, useEffect, useRef } from 'react'
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode'
import { ScanLine, CheckCircle, XCircle, RotateCcw, User, CalendarDays, Clock, MapPin, Zap } from 'lucide-react'

const SCANNER_ID = 'qrc-scanner-region'

const STATUS = { idle: 'idle', scanning: 'scanning', success: 'success', error: 'error' }

export default function ScannerPage() {
  const [status,   setStatus]   = useState(STATUS.idle)
  const [result,   setResult]   = useState(null)
  const [errMsg,   setErrMsg]   = useState('')
  const [camErr,   setCamErr]   = useState('')
  const scannerRef = useRef(null)

  const parseQR = (raw) => {
    try {
      const data = JSON.parse(raw)
      return { valid: true, ...data }
    } catch {
      // Plain text / URL
      return { valid: true, raw, eventTitle: 'Unknown Event', regId: raw.slice(0, 20) + '…' }
    }
  }

  const startScanner = () => {
    setCamErr('')
    setStatus(STATUS.scanning)
    setResult(null)

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
    }

    const scanner = new Html5QrcodeScanner(SCANNER_ID, config, false)
    scannerRef.current = scanner

    scanner.render(
      (decodedText) => {
        const parsed = parseQR(decodedText)
        setResult(parsed)
        setStatus(STATUS.success)
        scanner.clear().catch(() => {})
        scannerRef.current = null
      },
      (err) => {
        // Ignore frame-level not-found errors (they're continuous)
        if (String(err).includes('No MultiFormat Readers')) return
        setCamErr('Camera access denied or unavailable. Check permissions.')
        setStatus(STATUS.error)
        setErrMsg('Camera error. Please allow camera access and try again.')
      }
    )
  }

  const resetScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {})
      scannerRef.current = null
    }
    setStatus(STATUS.idle)
    setResult(null)
    setErrMsg('')
    setCamErr('')
  }

  useEffect(() => () => {
    if (scannerRef.current) scannerRef.current.clear().catch(() => {})
  }, [])

  // ── Idle state ─────────────────────────────────────────────────
  const IdleView = () => (
    <div className="text-center py-10">
      <div className="w-24 h-24 rounded-3xl border-2 border-dashed border-surface-700 flex items-center justify-center mx-auto mb-6 animate-float">
        <ScanLine size={40} className="text-surface-600" />
      </div>
      <h3 className="font-display text-xl font-semibold text-surface-200">Ready to Scan</h3>
      <p className="text-surface-500 text-sm mt-2 max-w-xs mx-auto">
        Point the camera at an attendee's QR registration code to check them in.
      </p>
      <button onClick={startScanner} className="btn-primary mt-8 px-8 py-3 text-base">
        <ScanLine size={18} /> Start Scanner
      </button>
    </div>
  )

  // ── Scanning state ─────────────────────────────────────────────
  const ScanningView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-neon-300">
          <div className="w-2 h-2 bg-neon-400 rounded-full animate-pulse" />
          Scanning…
        </div>
        <button onClick={resetScanner} className="btn-ghost text-sm">
          <XCircle size={14} /> Stop
        </button>
      </div>

      {/* html5-qrcode renders into this div */}
      <div
        id={SCANNER_ID}
        className="rounded-2xl overflow-hidden border border-surface-700 bg-surface-900"
        style={{ minHeight: 320 }}
      />

      {camErr && (
        <div className="bg-ember-400/10 border border-ember-400/30 text-ember-400 text-sm px-4 py-3 rounded-xl">
          {camErr}
        </div>
      )}

      <p className="text-center text-xs text-surface-600">
        Align the QR code within the frame
      </p>
    </div>
  )

  // ── Success state ──────────────────────────────────────────────
  const SuccessView = () => (
    <div className="animate-scale-in">
      <div className="glass-card p-8 border border-neon-400/30 text-center">
        {/* Header */}
        <div className="w-16 h-16 bg-neon-400/15 border border-neon-400/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-neon-400" />
        </div>
        <h3 className="font-display text-2xl font-bold text-surface-50">Check-in Successful!</h3>
        <p className="text-surface-400 text-sm mt-1">QR code verified and decoded</p>

        {/* Decoded data */}
        <div className="mt-6 space-y-3 text-left">
          {result?.event && (
            <div className="glass-light rounded-xl p-4">
              <p className="text-xs text-surface-500 mb-1 flex items-center gap-1"><CalendarDays size={10} />Event</p>
              <p className="font-semibold text-surface-100">{result.event}</p>
            </div>
          )}
          {result?.regId && (
            <div className="glass-light rounded-xl p-4">
              <p className="text-xs text-surface-500 mb-1 flex items-center gap-1"><Zap size={10} />Registration ID</p>
              <p className="font-mono text-sm text-neon-300">{result.regId}</p>
            </div>
          )}
          {result?.userId && (
            <div className="glass-light rounded-xl p-4">
              <p className="text-xs text-surface-500 mb-1 flex items-center gap-1"><User size={10} />User ID</p>
              <p className="font-mono text-sm text-surface-300">{result.userId}</p>
            </div>
          )}
          {result?.date && (
            <div className="glass-light rounded-xl p-4">
              <p className="text-xs text-surface-500 mb-1 flex items-center gap-1"><CalendarDays size={10} />Date</p>
              <p className="text-sm text-surface-300">{result.date}</p>
            </div>
          )}
          {result?.raw && !result?.event && (
            <div className="glass-light rounded-xl p-4">
              <p className="text-xs text-surface-500 mb-1">Raw Data</p>
              <p className="font-mono text-xs text-surface-300 break-all">{result.raw}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-7">
          <button onClick={startScanner} className="btn-primary flex-1">
            <ScanLine size={15} /> Scan Another
          </button>
          <button onClick={resetScanner} className="btn-secondary flex-1">
            <RotateCcw size={15} /> Reset
          </button>
        </div>
      </div>
    </div>
  )

  // ── Error state ────────────────────────────────────────────────
  const ErrorView = () => (
    <div className="text-center py-10">
      <div className="w-16 h-16 bg-ember-400/10 border border-ember-400/30 rounded-full flex items-center justify-center mx-auto mb-5">
        <XCircle size={32} className="text-ember-400" />
      </div>
      <h3 className="font-display text-xl font-semibold text-surface-200">Scan Failed</h3>
      <p className="text-surface-500 text-sm mt-2">{errMsg || 'Something went wrong.'}</p>
      <button onClick={resetScanner} className="btn-secondary mt-6">
        <RotateCcw size={14} /> Try Again
      </button>
    </div>
  )

  return (
    <div className="max-w-lg mx-auto animate-fade-in space-y-6">

      {/* Info banner */}
      <div className="glass-card p-4 flex items-start gap-3 border border-aqua-400/20">
        <div className="w-8 h-8 bg-aqua-400/15 rounded-lg flex items-center justify-center shrink-0">
          <ScanLine size={15} className="text-aqua-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-surface-200">Event Check-in Scanner</p>
          <p className="text-xs text-surface-500 mt-0.5">
            Use this to verify attendees at your event. Scan their QR code from the "My QR Codes" page.
          </p>
        </div>
      </div>

      {/* Main scanner card */}
      <div className="glass-card p-6">
        {status === STATUS.idle     && <IdleView     />}
        {status === STATUS.scanning && <ScanningView />}
        {status === STATUS.success  && <SuccessView  />}
        {status === STATUS.error    && <ErrorView    />}
      </div>

      {/* Tips */}
      {status === STATUS.idle && (
        <div className="glass-light rounded-2xl p-5">
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-widest mb-3">Tips for best results</p>
          <ul className="space-y-2 text-sm text-surface-500">
            {[
              'Ensure good lighting around the QR code',
              'Hold the device steady while scanning',
              'Keep the QR code within the green frame',
              'Allow camera permissions when prompted',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-neon-400 shrink-0 text-xs mt-0.5">◆</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  )
}
