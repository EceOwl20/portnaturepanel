import React, { useState } from 'react'

const Table = ({head, body, searchable}) => {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState(false);

    const filteredBody = body.filter(
        items => items.some(item => item.toString().toLocaleLowerCase("TR").includes(search.toLocaleLowerCase("TR")))
    ).sort((a, b) => {
        if (sort?.orderBy === "ASC") {
            return a[sort.index].toString().localeCompare(b[sort.index])
        }
        if (sort?.orderBy === "DESC") {
            return b[sort.index].toString().localeCompare(a[sort.index])
        }
    })
    console.log(search);
  return (
    <>
        {
            searchable && <input type="search" defaultValue={search} placeholder='Arama Yap' onChange={e => setSearch(e.target.value)} />
        }
        <table className='w-[90%] h-[10vh] border-collapse bg-white'>
            {
                head && head.length>0 && (
                    <thead className='bg-[#343a40] text-white'>
                        <tr className='bg-[#f2f2f2]'>
                            {
                                head.map((item, index)=>(
                                    <th key={index} className='bg-[#0e0c1b] font-bold text-white border-none px-[15px] py-[12px] text-left border border-[#ddd]' onClick={()=>{
                                        if(sort?.index == index) {
                                            setSort({
                                                index,
                                                orderBy: sort?.orderBy == "ASC" ? "DESC" : "ASC"
                                            })
                                        } else {
                                            setSort({
                                                index,
                                                orderBy: "ASC"
                                            })
                                        }
                                    }}>{item}</th>
                                ))
                            }
                        </tr>
                    </thead>
                )
                
            }
            {
                filteredBody && filteredBody.length>0 && (
                    <tbody>
                        {
                            filteredBody.map((items, index) => (
                                <tr key={index}>
                                    {
                                        items.map((item, index) => (
                                            <td className='text-[14px] text-[#333] bg-white px-[15px] py-[12px] text-left border border-[#ddd]' key={index}>
                                                {
                                                    Array.isArray(item) ? (
                                                        item.map((subItem, subIndex) => (
                                                            <React.Fragment key={subIndex}>{subItem}</React.Fragment>
                                                        ))
                                                    ) : (
                                                        (typeof item === "string" && item.match(/\.(jpeg|jpg|gif|png)$/i)) ? (
                                                            <img src={item} alt='Görsel' width="200" height="100" />
                                                        ) : (
                                                            item
                                                        )
                                                    )
                                                }
                                            </td>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                )
            }
        </table>
    </>
  )
}

export default Table