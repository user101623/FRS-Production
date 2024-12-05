import PropTypes from 'prop-types';

const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-gray-800 rounded-lg p-4 w-11/12 max-w-md">
                <h2 className="text-lg font-bold text-white text-center">Streaming Stopped</h2>
                <p className="text-gray-300 text-center">The video stream has been stopped.</p>
                <button
                    onClick={onClose}
                    className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-md w-full"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Modal;