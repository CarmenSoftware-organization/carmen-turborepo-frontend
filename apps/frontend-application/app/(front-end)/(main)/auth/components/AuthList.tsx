'use client';
import React from 'react';
import SignIn from './form/SignIn';

const AuthList = () => {

    return (
        <div className='flex flex-col justify-center items-center h-[100vh]'>
            <div className='my-auto mb-auto mt-8 flex flex-col md:mt-[70px] w-[350px] max-w-[450px] mx-auto md:max-w-[450px] lg:mt-[130px] lg:max-w-[450px]'>
                <SignIn />
            </div>
        </div>

    )
}

export default AuthList