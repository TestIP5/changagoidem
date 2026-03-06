using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.interfaces
{
    public interface ICTGioHangBS
    {
        void InsertCTGioHang(ChiTietGioHang1 comment);

        void UpdateCTGioHangTang(ChiTietGioHang1 comment);
        
        void UpdateCTGioHangGiam(ChiTietGioHang1 comment);

        void DeleteCTGioHang(int commentID,int commentID2);


        List<ChiTietGioHang> GetAll();
    }
}
