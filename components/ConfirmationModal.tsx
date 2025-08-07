import React, { useEffect, useRef } from 'react';
import { WarningIcon } from './Icons.tsx';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Accessibility: Handle keyboard events (Escape key)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Accessibility: Focus trapping
    useEffect(() => {
        if (isOpen && modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            const handleTabKeyPress = (e: KeyboardEvent) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) { // Shift + Tab
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else { // Tab
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            };
            
            const confirmButton = Array.from(focusableElements).find(el => el.textContent === 'Delete');
            (confirmButton || firstElement)?.focus();

            modalRef.current.addEventListener('keydown', handleTabKeyPress);
            
            return () => {
                modalRef.current?.removeEventListener('keydown', handleTabKeyPress);
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-modal-title"
        >
            <div
                ref={modalRef}
                className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all p-6"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-start space-x-4">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                        <WarningIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="flex-grow">
                        <h3 className="text-lg leading-6 font-bold text-white" id="confirmation-modal-title">
                            {title}
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-300">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
