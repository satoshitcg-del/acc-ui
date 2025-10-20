import React from 'react'

interface TelegramProps {
    status: boolean
}

export const Telegram = (props: TelegramProps) => {
    const { status } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill={status ? "url(#paint0_linear_3777_437)" : "#E0E0E0"} />
            <path d="M9.8002 17.5C9.41144 17.5 9.4775 17.3532 9.34342 16.9831L8.2002 13.2206L17.0002 8" fill="#C8DAEA" />
            <path d="M9.7998 17.4997C10.0998 17.4997 10.2324 17.3625 10.3998 17.1997L11.9998 15.6439L10.004 14.4404" fill="#A9C9DD" />
            <path d="M10.0042 14.4407L14.8402 18.0136C15.3921 18.3181 15.7904 18.1605 15.9278 17.5013L17.8963 8.225C18.0979 7.41698 17.5883 7.0505 17.0604 7.29018L5.50137 11.7473C4.71236 12.0637 4.71696 12.5039 5.35755 12.7001L8.32385 13.6259L15.1912 9.29341C15.5153 9.09682 15.8129 9.20251 15.5687 9.41925" fill="url(#paint1_linear_3777_437)" />
            <defs>
                <linearGradient id="paint0_linear_3777_437" x1="9.0012" y1="1.0008" x2="3.0012" y2="15" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#37AEE2" />
                    <stop offset="1" stopColor="#1E96C8" />
                </linearGradient>
                <linearGradient id="paint1_linear_3777_437" x1="10.498" y1="12.7369" x2="11.7802" y2="16.8843" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#EFF7FC" />
                    <stop offset="1" stopColor="white" />
                </linearGradient>
            </defs>
        </svg>
    );
}
