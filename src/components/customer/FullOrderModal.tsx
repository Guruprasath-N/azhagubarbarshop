import React from 'react';
import { Appointment, Salon } from '../../types';
import { formatTime12h } from '../../services/availabilityEngine';
import {
  X,
  Printer,
  CheckCircle2,
  MapPin,
  Phone,
  Calendar,
  Clock,
  User,
  Scissors,
  QrCode,
  ShieldCheck,
  FileText,
  Navigation,
  Download
} from 'lucide-react';

interface FullOrderModalProps {
  appointment: Appointment;
  salon?: Salon;
  onClose: () => void;
  onNavigateToSalon?: (salonId: string) => void;
}

export const FullOrderModal: React.FC<FullOrderModalProps> = ({
  appointment,
  salon,
  onClose,
  onNavigateToSalon
}) => {
  const basePrice = Math.round(appointment.total_price / 1.18);
  const cgst = Math.round((appointment.total_price - basePrice) / 2);
  const sgst = appointment.total_price - basePrice - cgst;
  const orderRef = `ORD-TN-${appointment.id.toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="modal-full-order-invoice"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/75 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white border border-neutral-200 rounded-md max-w-2xl w-full shadow-2xl my-6 text-neutral-900 overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Ribbon */}
        <div className="bg-neutral-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  Official Digital Pass & Tax Invoice
                </span>
                <span className="px-1.5 py-0.2 text-[10px] font-mono bg-emerald-500/20 text-emerald-300 rounded-xs border border-emerald-400/30">
                  {appointment.status}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-light text-white tracking-tight">
                Order Reference #{orderRef}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 text-xs max-h-[80vh] overflow-y-auto">
          {/* Studio Header Information */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-neutral-200">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-0.5">
                Service Provider & Location
              </span>
              <h4 className="text-base font-semibold text-neutral-950">
                {appointment.salon_name}
              </h4>
              <p className="text-neutral-600 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-none" />
                <span>{salon?.address || 'Anna Nagar 2nd Avenue'}, {salon?.city || 'Chennai'}, Tamil Nadu</span>
              </p>
              <p className="text-neutral-500 flex items-center gap-1.5 mt-0.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-neutral-400 flex-none" />
                <span>Studio Helpdesk: {salon?.phone || '+91 98401 23456'}</span>
              </p>
            </div>

            <div className="sm:text-right font-mono text-[11px] text-neutral-500 space-y-1 bg-neutral-50 p-2.5 rounded-xs border border-neutral-200/80">
              <div>GSTIN: <span className="font-semibold text-neutral-900">33AAACA1234F1Z5</span></div>
              <div>SAC Code: <span className="font-semibold text-neutral-900">999721</span></div>
              <div>Date: <span className="font-semibold text-neutral-900">{appointment.appointment_date}</span></div>
            </div>
          </div>

          {/* Customer & Schedule Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-sm border border-neutral-200/70">
            <div>
              <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                Client Contact Details
              </span>
              <p className="font-semibold text-neutral-900 text-sm">{appointment.customer_name}</p>
              <p className="text-neutral-600 font-mono mt-0.5">{appointment.customer_phone}</p>
              <p className="text-neutral-500 font-mono text-[11px]">{appointment.customer_email}</p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                Scheduled Slot & Specialist
              </span>
              <p className="font-semibold text-neutral-900 flex items-center gap-1.5 text-sm">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>{appointment.appointment_date}</span>
                <span className="text-neutral-400 font-normal">at</span>
                <Clock className="w-3.5 h-3.5 text-amber-600 ml-1" />
                <span>{formatTime12h(appointment.start_time)} – {formatTime12h(appointment.end_time)}</span>
              </p>
              <p className="text-neutral-700 flex items-center gap-1.5 mt-1 font-medium">
                <User className="w-3.5 h-3.5 text-neutral-400" />
                <span>Assigned Stylist: {appointment.staff_name}</span>
              </p>
            </div>
          </div>

          {/* Order Progress Stepper */}
          <div className="bg-white border border-neutral-200 rounded-sm p-4">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-3">
              Order Fulfillment Live Status
            </span>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
              <div className="space-y-1">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs font-bold">
                  ✓
                </div>
                <span className="font-bold text-neutral-900 block">1. Booked</span>
                <span className="text-neutral-400 text-[9px]">Verified online</span>
              </div>
              <div className="space-y-1">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs font-bold">
                  ✓
                </div>
                <span className="font-bold text-neutral-900 block">2. Confirmed</span>
                <span className="text-neutral-400 text-[9px]">Studio locked slot</span>
              </div>
              <div className="space-y-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                  appointment.status === 'CONFIRMED' || appointment.status === 'COMPLETED'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-200 text-neutral-600'
                }`}>
                  ✓
                </div>
                <span className="font-bold text-neutral-900 block">3. Specialist</span>
                <span className="text-neutral-400 text-[9px]">Station prepared</span>
              </div>
              <div className="space-y-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                  appointment.status === 'COMPLETED'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                }`}>
                  {appointment.status === 'COMPLETED' ? '✓' : '4'}
                </div>
                <span className="font-bold text-neutral-900 block">
                  {appointment.status === 'COMPLETED' ? '4. Completed' : '4. Check-in'}
                </span>
                <span className="text-neutral-400 text-[9px]">
                  {appointment.status === 'COMPLETED' ? 'Treatment finished' : 'Arrive at counter'}
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Billing Table */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-2">
              Itemized Tax Invoice Breakdown
            </span>
            <div className="border border-neutral-200 rounded-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100 text-neutral-700 font-mono text-[11px] border-b border-neutral-200">
                  <tr>
                    <th className="py-2.5 px-3">Service Description</th>
                    <th className="py-2.5 px-3 text-center">Qty / Duration</th>
                    <th className="py-2.5 px-3 text-right">Taxable Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-neutral-900">{appointment.service_name}</div>
                      <div className="text-[11px] text-neutral-500">
                        Stylist: {appointment.staff_name} · Ayurvedic formulation & traditional scissors
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-neutral-600">
                      1 session (60 min)
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-neutral-900">
                      ₹{basePrice.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-neutral-50 border-t border-neutral-200 text-[11px] font-mono">
                  <tr>
                    <td colSpan={2} className="py-1.5 px-3 text-neutral-600 text-right">
                      Net Taxable Base Amount:
                    </td>
                    <td className="py-1.5 px-3 text-right font-medium text-neutral-900">
                      ₹{basePrice.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="py-1.5 px-3 text-neutral-600 text-right">
                      CGST @ 9%:
                    </td>
                    <td className="py-1.5 px-3 text-right font-medium text-neutral-900">
                      ₹{cgst.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="py-1.5 px-3 text-neutral-600 text-right">
                      SGST @ 9%:
                    </td>
                    <td className="py-1.5 px-3 text-right font-medium text-neutral-900">
                      ₹{sgst.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="border-t border-neutral-200 bg-neutral-100 text-xs font-bold text-neutral-950">
                    <td colSpan={2} className="py-2.5 px-3 text-right uppercase">
                      Total Invoice Amount (Gross):
                    </td>
                    <td className="py-2.5 px-3 text-right text-base text-neutral-950">
                      ₹{appointment.total_price.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="pt-1.5 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Payment Mode: Pay at Studio Counter (UPI / Card / Cash)</span>
              </span>
              <span>Price inclusive of all statutory GST</span>
            </div>
          </div>

          {/* Client Notes & Check-in QR Token Pass */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-amber-50/60 border border-amber-200/80 rounded-sm p-4">
            <div className="sm:col-span-8 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-amber-900 font-bold block">
                Digital Check-in Token & Studio Pass
              </span>
              <p className="text-neutral-700 text-xs leading-relaxed">
                Scan this QR code upon arrival at <strong className="text-neutral-900">{appointment.salon_name}</strong> reception for fast-track zero-queue entry.
              </p>
              {appointment.notes && (
                <div className="text-[11px] text-neutral-600 bg-white/80 p-2 rounded-xs border border-amber-200">
                  <span className="font-semibold text-neutral-900">Special Instructions: </span>
                  {appointment.notes}
                </div>
              )}
            </div>

            {/* Visual QR Pass box */}
            <div className="sm:col-span-4 flex flex-col items-center justify-center p-2.5 bg-white border border-amber-300 rounded-sm text-center shadow-xs">
              <div className="w-20 h-20 bg-neutral-950 text-white rounded-xs p-1 flex items-center justify-center mb-1">
                <QrCode className="w-16 h-16 text-white" />
              </div>
              <span className="font-mono text-[10px] font-bold text-neutral-900 tracking-wider block">
                {orderRef}
              </span>
              <span className="text-[9px] text-neutral-400 font-mono">Verified Studio Pass</span>
            </div>
          </div>

          {/* Studio Rules & Guidelines */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-sm text-[11px] text-neutral-500 space-y-1">
            <div className="font-semibold text-neutral-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Studio Treatment Guidelines:</span>
            </div>
            <p>• Please arrive 5 to 10 minutes before your slot to allow hair diagnosis and consultation.</p>
            <p>• Rescheduling or cancellation is available free of charge up to 2 hours prior to the slot time.</p>
            <p>• High-grade organic extracts and traditional salon protocols strictly enforced.</p>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-neutral-50 border-t border-neutral-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-semibold rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-600" />
              <span>Print Tax Invoice</span>
            </button>
            {salon && onNavigateToSalon && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToSalon(salon.id);
                }}
                className="px-3.5 py-2 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-semibold rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Scissors className="w-3.5 h-3.5 text-neutral-600" />
                <span>Salon Page</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-neutral-950 text-white text-xs font-semibold rounded-sm hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
            >
              Close Pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
