interface Props{
    children:React.ReactNode;
}


 export const layout=({children}:Props)=>{
    return(
        <>
        <div className="h-screen bg-black">
            {children}
        </div>
        </>
    )
}