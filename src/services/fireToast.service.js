import Swal from 'sweetalert2';

export function FireErrorToast(title, text) {
    Swal.fire({
        icon: 'error',
        title: title || 'Oops...',
        text: text || 'The third-party API has malfunctioned!',
    });
}