'use client'
import { useMutation } from '@tanstack/react-query'
import { useState, useRef, useEffect } from 'react'
import { RotateCcw, Download, CheckSquare, Square } from 'lucide-react'
import { APIURL } from '@/data/consts'
import { toast } from 'sonner'
import { PDFCheckerService } from '@/services/PDFCheckerService'
import { PDFResultCheck } from '@/interfaces/pdf'
import { getFetch } from '@/lib/fetch'
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalHeader, ResponsiveModalTitle, ResponsiveModalTrigger } from '../ui/responsiveModal'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'

interface Props {
  runID: number
  poll: boolean
}

interface PDFOption {
  id: "sr0" | "sr1" | "sr2" | "sr3" | "sr4"
  label: string
  available: boolean
  selected: boolean
}

const ExportDropDown = ({ runID, poll }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showToast, setShowToast] = useState(true)
  const [inProgress, setInProgress] = useState(true)
  const [isPDFPolling, setIsPDFPolling] = useState(false)
  const [pdfOptions, setPdfOptions] = useState<PDFOption[]>([
    { id: "sr0", label: "قبولی بر اساس رشته (sr0)", available: false, selected: false },
    { id: "sr1", label: "قبولی بر اساس دانشجویان (sr1)", available: false, selected: false },
    { id: "sr2", label: "کارنامه ها (sr2)", available: false, selected: false },
    { id: "sr3", label: "قبولی بر اساس رشته صفحه ای (sr3)", available: false, selected: false },
    { id: "sr4", label: "قبولی بر اساس رشته کوتاه شده (sr4)", available: false, selected: false },
  ])

  const pollingPDFIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const startPollingPDF = () => {
    stopPollingPDF()
    setShowToast(false)
    setIsPDFPolling(true)
    
    let retryCount = 0
    const maxRetries = 30
    
    pollingPDFIntervalRef.current = setInterval(async () => {
      try {
        retryCount++
        PDFChecker.mutate()

        if (retryCount > maxRetries) {
          stopPollingPDF()
          toast.error('خطا در بروزرسانی وضعیت')
        }
      } catch (error) {
        console.error('Polling error:', error)
        stopPollingPDF()
        setIsPDFPolling(false)
        toast.error('خطا در بروزرسانی وضعیت')
      }
    }, 5000)
  }

  const stopPollingPDF = () => {
    if (pollingPDFIntervalRef.current) {
      clearInterval(pollingPDFIntervalRef.current)
      pollingPDFIntervalRef.current = null
      setIsPDFPolling(false)
      setShowToast(true)
    }
  }

  useEffect(() => {
    return () => {
      stopPollingPDF()
    }
  }, [])

  const PDFChecker = useMutation<any, Error>({
    mutationFn: async () => PDFCheckerService(runID),
    onSuccess: async ({ result: { sr0, sr1, sr2, sr3, sr4 }, message }: PDFResultCheck) => {
      console.log('pdf checked')

      if (!message) {
        setPdfOptions(prev => prev.map(option => ({
          ...option,
          available: option.id === "sr0" ? sr0 :
                    option.id === "sr1" ? sr1 :
                    option.id === "sr2" ? sr2 :
                    option.id === "sr3" ? sr3 :
                    option.id === "sr4" ? sr4 : false
        })))
        setInProgress(false)
        setIsOpen(true)
      } else if (message == 'پی دی اف ها در حال ساخت می باشند ، لطفا صبور باشید') {
        showToast ? toast.success(message) : ''
        startPollingPDF()
      } else if (message == 'مشکلی در ساخت پی دی اف ها به وجود آمد، لطفا دوباره تلاش کنید') {
        toast.error(message)
      }
    },
    onError: (error) => {
      console.log('pdf check failed')
      toast.error('مشکلی رخ داده است')
    },
  })

  const toggleOptionSelection = (id: "sr0" | "sr1" | "sr2" | "sr3" | "sr4") => {
    setPdfOptions(prev => prev.map(option => 
      option.id === id ? { ...option, selected: !option.selected } : option
    ))
  }

  const selectAllAvailable = () => {
    setPdfOptions(prev => prev.map(option => ({
      ...option,
      selected: option.available
    })))
  }

  const clearAllSelections = () => {
    setPdfOptions(prev => prev.map(option => ({
      ...option,
      selected: false
    })))
  }

  const downloadPDF = useMutation({
    mutationFn: async (type: "sr0" | "sr1" | "sr2" | "sr3" | "sr4") => {
      const response = await getFetch(APIURL + `admins/download/${type}/${runID}`)
      if (!response.ok) {
        throw new Error('Failed to download PDF')
      }
      return response.blob()
    },
    onSuccess: (blob, type) => {
      const now = new Date()
      const formattedDate = now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(',', '').replace(/:/g, '-')

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `${type}-${formattedDate}.pdf`
      document.body.appendChild(a)
      a.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success(`فایل ${type} با موفقیت دانلود شد`)
    },
    onError: () => {
      toast.error('خطایی پیش آمده لطفا دوباره تلاش کنید')
    }
  })

  const downloadSelectedPDFs = async () => {
    const selectedOptions = pdfOptions.filter(option => option.selected && option.available)
    
    if (selectedOptions.length === 0) {
      toast.error('لطفا حداقل یک گزینه را انتخاب کنید')
      return
    }

    for (const option of selectedOptions) {
      try {
        await downloadPDF.mutateAsync(option.id)
      } catch (error) {
        console.error(`Error downloading ${option.id}:`, error)
        toast.error(`خطا در دانلود ${option.id}`)
      }
    }
    
    if (selectedOptions.length > 1) {
      toast.success('تمام فایل های انتخاب شده دانلود شدند')
    }
  }

  const availableCount = pdfOptions.filter(opt => opt.available).length
  const selectedCount = pdfOptions.filter(opt => opt.selected).length

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <ResponsiveModalTrigger asChild>
        <button
          onClick={() => PDFChecker.mutate()}
          className="flex items-center justify-center p-2 rounded-lg transition-all hover:bg-gray-100 text-gray-500"
          aria-label="خروجی PDF گزارش"
        >
          <div className="relative group">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-primary"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
        </button>
      </ResponsiveModalTrigger>

      <ResponsiveModalContent
        position="center"
        className="bg-card border-border md:w-fit"
      >
        <ResponsiveModalHeader className="border-border">
          <ResponsiveModalTitle className="text-xl sm:text-2xl text-right text-foreground">
            استخراج PDF  ها
          </ResponsiveModalTitle>
        </ResponsiveModalHeader>
       
        <div className="relative inline-block text-right" dir="rtl">
          <div ref={popoverRef} className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-900">استخراج PDF نتایج</h3>
              <div className="flex gap-2">
                {availableCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllAvailable}
                    className="text-xs h-8"
                  >
                    انتخاب همه
                  </Button>
                )}
                {selectedCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllSelections}
                    className="text-xs h-8"
                  >
                    لغو همه
                  </Button>
                )}
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              {pdfOptions.map((option) => (
                <div key={option.id} className="flex items-center gap-3 p-2 rounded border">
                  <Checkbox
                    id={option.id}
                    checked={option.selected}
                    onCheckedChange={() => toggleOptionSelection(option.id)}
                    disabled={!option.available}
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor={option.id}
                    className={`flex-1 text-sm cursor-pointer ${!option.available ? 'text-gray-400' : 'text-foreground'}`}
                  >
                    {option.label}
                    {!option.available && ' (غیرفعال)'}
                  </Label>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {selectedCount} مورد انتخاب شده
              </span>
              <Button
                onClick={downloadSelectedPDFs}
                disabled={selectedCount === 0}
                className="gap-2"
              >
                <Download size={16} />
                دانلود انتخاب شده‌ها
              </Button>
            </div>
          </div>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  )
}

export default ExportDropDown