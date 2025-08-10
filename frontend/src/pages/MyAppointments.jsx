import axios from 'axios'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { PuffLoader } from 'react-spinners'
import { AppContext } from '../context/AppContext'

function MyAppointments() {
  const { backendUrl, token, getAllDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null)

  const getUserAppointment = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get(
        backendUrl + '/api/user/list-appointment',
        { headers: { token } }
      )

      if (data.success && Array.isArray(data.appointmentData)) {
        setAppointments(data.appointmentData.reverse())
      } else {
        setAppointments([])
        toast.warn('No appointments found')
      }
    } catch (error) {
      console.log('Error:', error)
      setAppointments([])
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointment()
    }
  }, [token])

  const handleCancelClick = appointmentId => {
    setSelectedAppointmentId(appointmentId)
    setShowCancelModal(true)
  }

  const cancelAppointment = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/cancel-appointment',
        { appointmentId: selectedAppointmentId },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message, {
          icon: '☹️',
        })
        getUserAppointment()
        getAllDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      const errorMessage =
        error.response?.data?.message || error.message || 'Something went wrong'

      toast.error(errorMessage)
    } finally {
      setShowCancelModal(false)
      setSelectedAppointmentId(null)
    }
  }

  const initPay = async order => {
    // Validate the order object first
    if (!order || !order.id || !order.amount || !order.currency) {
      toast.error('Invalid payment order details')
      return
    }

    // Ensure Razorpay is loaded
    if (!window.Razorpay) {
      toast.error('Payment system not available. Please try again later.')
      return
    }

    // Log the key to verify it's available (remove in production)
    console.log('Razorpay Key:', import.meta.env.VITE_RAZORPAY_KEYID)

    const options = {
      key: 'rzp_test_x1llhz6bFI65Rf',
      amount: order.amount.toString(),
      currency: order.currency,
      name: 'My Healthcare App',
      description: `Appointment #${order.receipt || 'NA'}`,
      order_id: order.id,
      image: '/logo.png',
      theme: {
        color: '#3399cc',
      },
      handler: async response => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verifyRazorpay`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              appointmentId: order.receipt,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )

          if (data.success) {
            toast.success('Payment successful!')
            await getUserAppointment()
          } else {
            toast.error(data.message || 'Payment verification failed')
          }
        } catch (error) {
          console.error('Payment verification error:', error)
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'Payment verification failed'
          toast.error(errorMessage)
        }
      },
    }

    try {
      const rzp = new window.Razorpay(options)

      rzp.on('payment.failed', response => {
        console.error('Payment failed:', response.error)
        toast.error(`Payment failed: ${response.error.description}`)
      })

      rzp.open()
    } catch (err) {
      console.error('Razorpay init error:', err)
      toast.error('Could not initialize payment gateway')
    }
  }

  const appointmentRazorpay = async appointmentId => {
    const { data } = await axios.post(
      backendUrl + '/api/user/payment-razorpay',
      { appointmentId },
      { headers: { token } }
    )
    if (data.success) {
      initPay(data.order)
    }
  }

  const filterAppointments = () => {
    console.log('Current Filter:', filter)
    return appointments.filter(item => {
      if (filter === 'all') return true
      if (filter === 'upcoming') return !item.cancelled && !item.isCompleted
      if (filter === 'completed') return item.isCompleted === true
      if (filter === 'cancelled') return item.cancelled === true
      if (filter === 'paid') return item.payment === true
      return false
    })
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    doc.text('Appointment Report', 14, 10)

    const tableData = filterAppointments().map((item, index) => [
      index + 1,
      item.docData.name,
      item.docData.speciality,
      item.slotDate,
      item.slotTime,
      item.isCompleted
        ? 'Completed'
        : item.cancelled
        ? 'Cancelled'
        : 'Upcoming',
    ])

    autoTable(doc, {
      head: [['S.No', 'Doctor Name', 'Speciality', 'Date', 'Time', 'Status']],
      body: tableData,
    })

    doc.save('Appointment_Report.pdf')
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center'>
        <PuffLoader />
      </div>
    )
  }

  return (
    <div>
      <p className='pb-3 mt-12 border-b text-zinc-700 font-medium'>
        My Appointments
      </p>

      {/* Filter Buttons */}
      <div className='md:flex gap-4 mb-4 mt-4'>
        {'all upcoming completed cancelled paid'.split(' ').map(type => (
          <button
            key={type}
            className={`px-4 py-2 rounded ${
              filter === type ? 'bg-blue-500 text-white' : 'border'
            }`}
            onClick={() => setFilter(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}

        <button
          onClick={downloadPDF}
          className='px-4 py-2 rounded bg-green-500 text-white flex items-end'
        >
          Download Report
        </button>
      </div>

      {/* Appointment List */}
      <div>
        {filterAppointments().length > 0 ? (
          filterAppointments().map((item, index) => (
            <div
              className='grid grid-cols-[1fr_2fr] sm:flex gap-4 sm:gap-6 py-2 border-b'
              key={index}
            >
              <img
                className='w-32 bg-indigo-50'
                src={item.docData.image}
                alt=''
              />
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='font-semibold text-lg text-black'>
                  {item.docData.name}
                </p>
                <p>{item.docData.speciality}</p>
                <p className='font-medium text-zinc-700 mt-1'>Date & Time:</p>
                <p>
                  {item.slotDate} | {item.slotTime}
                </p>
              </div>
              <div className='flex flex-col justify-end gap-2'>
                {!item.cancelled && item.payment && !item.isCompleted && (
                  <button className='text-sm text-center text-stone-500 border sm:min-w-48 rounded py-2 bg-indigo-100'>
                    Paid
                  </button>
                )}
                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <button
                    onClick={() => appointmentRazorpay(item._id)}
                    className='text-sm text-center text-stone-700 border sm:min-w-48 rounded py-2 hover:bg-blue-500 hover:text-white transition-all duration-300'
                  >
                    Pay Online
                  </button>
                )}
                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => handleCancelClick(item._id)}
                    className='text-sm text-center text-stone-700 border sm:min-w-48 rounded py-2 hover:bg-red-500 hover:text-white transition-all duration-300'
                  >
                    Cancel appointment
                  </button>
                )}
                {item.cancelled && !item.isCompleted && (
                  <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>
                    Appointment Cancelled
                  </button>
                )}
                {item.isCompleted && (
                  <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500 bg-green-50'>
                    Completed
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className='text-center py-4 text-gray-500'>
            No appointments found
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full'>
            <h3 className='text-lg font-medium mb-4'>Cancel Appointment</h3>
            <p className='mb-6'>
              Are you sure you want to cancel this appointment?
            </p>
            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setShowCancelModal(false)}
                className='px-4 py-2 border rounded hover:bg-gray-100'
              >
                No, Keep It
              </button>
              <button
                onClick={cancelAppointment}
                className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyAppointments
