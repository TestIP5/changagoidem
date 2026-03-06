using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.interfaces
{
    public interface INguoiDungBS
    {
        void InsertNguoiDung(NguoiDungDoi nguoiDung);

        void UpdateNguoiDung(NguoiDungDoi nguoiDung);

        void DeleteNguoiDung(string nguoiDungID);

        NguoiDung GetUserByID(string UserID);

        List<NguoiDung> GetAll();
    }
}
