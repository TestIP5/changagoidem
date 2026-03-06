using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interfaces
{
    public interface IGioHangRP
    {
        void InsertGioHang(GioHang gioHang);

        void UpdateGioHang(GioHang gioHang);

        void DeleteGioHang(int gioHangID);

        GioHang GetGioHangByID(int gioHangID);

        List<GioHang> GetAll();
    }
}
