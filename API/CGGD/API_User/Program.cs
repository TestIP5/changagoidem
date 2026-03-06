

using BLL.interfaces;
using BLL;
using DAL.Interfaces;
using DAL;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddTransient<IBinhLuanRP, BinhLuanRP>();
builder.Services.AddTransient<IBinhLuanBS, BinhLuanBS>();

builder.Services.AddTransient<IGioHangRP, GioHangRP>();
builder.Services.AddTransient<IGioHangBS, GioHangBS>();

builder.Services.AddTransient<IDonHangRP, DonHangRP>();
builder.Services.AddTransient<IDonHangBS, DonHangBS>();

builder.Services.AddTransient<ISanPham, SanPhamRP>();
builder.Services.AddTransient<ISanPhamBS, SanPhamBS>();

builder.Services.AddTransient<INguoiDungRP, NguoiDungRP>();
builder.Services.AddTransient<INguoiDungBS, NguoiDungBS>();



builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



// Configure the HTTP request pipeline.



builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(); 

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

