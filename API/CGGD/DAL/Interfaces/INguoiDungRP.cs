using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interfaces
{
    public interface INguoiDungRP
    {
        void InsertNguoiDung(NguoiDungDoi nguoiDung);

        void UpdateNguoiDung(NguoiDungDoi nguoiDung);

        void DeleteNguoiDung(string nguoiDungID);

        NguoiDung GetUserByID(string IDUser);

        List<NguoiDung> GetAll();
    }
}
