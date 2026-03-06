using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.interfaces
{
    public interface IGioHangBS
    {
        void InsertGioHang(GioHang gioHang);

        void UpdateGioHang(GioHang gioHang);

        void DeleteGioHang(int gioHangID);

        List<GioHang> GetAll(); 
        GioHang GetGioHangByID(int gioHangID);
    }
}
