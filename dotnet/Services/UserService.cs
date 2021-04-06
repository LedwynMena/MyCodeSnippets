using BCrypt;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Users;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Sabio.Services
{
	public class UserService : IUserService, IUserDetailMapper
	{
		private IAuthenticationService<int> _authenticationService;
		private IDataProvider _dataProvider;

		public UserService(IAuthenticationService<int> authSerice, IDataProvider dataProvider)
		{
			_authenticationService = authSerice;
			_dataProvider = dataProvider;
		}

		public int RegisterUser(UserAddRequest model)
		{
			int id = 0;

			string salt = BCrypt.BCryptHelper.GenerateSalt();
			string hashedPassword = BCrypt.BCryptHelper.HashPassword(model.Password, salt);

			string procName = "[dbo].[Users_Insert]";
			_dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
			{
				MapUserParamCol(model, col);
				col.AddWithValue("@Password", hashedPassword);
				col.AddWithValue("@RoleId", model.RoleId);

				SqlParameter idOut = new SqlParameter("@Id", System.Data.SqlDbType.Int);
				idOut.Direction = System.Data.ParameterDirection.Output;

				col.Add(idOut);

			}, returnParameters: delegate (SqlParameterCollection returnCollection)
			{
				object oId = returnCollection["@Id"].Value;
				int.TryParse(oId.ToString(), out id);
			});

			return id;
		}

		public int InsertToken(string token, int userId, int tokenType)
		{
			int id = 0;

			string procName = "[dbo].[UserTokens_Insert]";
			_dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
			{
				col.AddWithValue("@Token", token);
				col.AddWithValue("@UserId", userId);
				col.AddWithValue("@TokenType", tokenType);

				SqlParameter idOut = new SqlParameter("@Id", System.Data.SqlDbType.Int);
				idOut.Direction = System.Data.ParameterDirection.Output;

				col.Add(idOut);

			}, returnParameters: delegate (SqlParameterCollection returnCollection)
			{
				object oId = returnCollection["@Id"].Value;
				int.TryParse(oId.ToString(), out id);
			});

			return id;
		}

		public Paged<User> GetAllByPagination(int pageIndex, int pageSize)
		{
			Paged<User> pagedResult = null;
			List<User> result = null;

			int totalCount = 0;
			string procName = "[dbo].[Users_SelectAll_WithRoles]";
			_dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
			{
				parameterCollection.AddWithValue("@pageIndex", pageIndex);
				parameterCollection.AddWithValue("@pageSize", pageSize);
			}, singleRecordMapper: delegate (IDataReader reader, short set)
			{
				int index = 0;
				User user = MapUser(reader, ref index);

				if (totalCount == 0)
				{
					totalCount = reader.GetSafeInt32(index);
				}
				if (result == null)
				{
					result = new List<User>();
				}
				result.Add(user);

			});
			if (result != null)
			{
				pagedResult = new Paged<User>(result, pageIndex, pageSize, totalCount);
			}
			return pagedResult;
		}

		public Paged<User> SearchUsers(int pageIndex, int pageSize, string query)
		{
			Paged<User> pagedResult = null;
			List<User> result = null;

			int totalCount = 0;
			string procName = "[dbo].[Users_Search_FirstLastEmail]";
			_dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
			{
				parameterCollection.AddWithValue("@pageIndex", pageIndex);
				parameterCollection.AddWithValue("@pageSize", pageSize);
				parameterCollection.AddWithValue("@query", query);
			},
			singleRecordMapper: delegate (IDataReader reader, short set)
			{
				int index = 0;
				User user = MapUser(reader, ref index);

				if (totalCount == 0)
				{
					totalCount = reader.GetSafeInt32(index);
				}
				if (result == null)
				{
					result = new List<User>();
				}
				result.Add(user);

			});
			if (result != null)
			{
				pagedResult = new Paged<User>(result, pageIndex, pageSize, totalCount);
			}
			return pagedResult;
		}

		public Paged<User> SearchByRole(int pageIndex, int pageSize, string role)
		{
			Paged<User> pagedResult = null;
			List<User> result = null;

			int totalCount = 0;
			string procName = "[dbo].[Users_Select_ByRole]";
			_dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
			{
				parameterCollection.AddWithValue("@pageIndex", pageIndex);
				parameterCollection.AddWithValue("@pageSize", pageSize);
				parameterCollection.AddWithValue("@role", role);
			},
			singleRecordMapper: delegate (IDataReader reader, short set)
			{
				int index = 0;
				User user = MapUser(reader, ref index);

				if (totalCount == 0)
				{
					totalCount = reader.GetSafeInt32(index);
				}
				if (result == null)
				{
					result = new List<User>();
				}
				result.Add(user);
			}
			);
			if (result != null)
			{
				pagedResult = new Paged<User>(result, pageIndex, pageSize, totalCount);
			}
			return pagedResult;
		}

		public Paged<User> SearchByStatus(int pageIndex, int pageSize, string status)
		{
			Paged<User> pagedResult = null;
			List<User> result = null;

			int totalCount = 0;
			string procName = "[dbo].[Users_Select_ByStatus]";
			_dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
			{
				parameterCollection.AddWithValue("@pageIndex", pageIndex);
				parameterCollection.AddWithValue("@pageSize", pageSize);
				parameterCollection.AddWithValue("@status", status);
			},
			singleRecordMapper: delegate (IDataReader reader, short set)
			{
				int index = 0;
				User user = MapUser(reader, ref index);

				if (totalCount == 0)
				{
					totalCount = reader.GetSafeInt32(index);
				}
				if (result == null)
				{
					result = new List<User>();
				}
				result.Add(user);
			}
			);
			if (result != null)
			{
				pagedResult = new Paged<User>(result, pageIndex, pageSize, totalCount);
			}
			return pagedResult;
		}

		public UserAuth GetByEmail(string email)
		{
			string procName = "[dbo].[Users_Select_ByEmailAuth]";

			UserAuth user = null;

			_dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
			{
				paramCollection.AddWithValue("@Email", email);
			}, delegate (IDataReader reader, short set)
			{
				int index = 0;
				user = MapUserAuth(reader, ref index);
			});

			return user;
		}

		public int GetUserIdByEmail(string email)
		{
			string procName = "[dbo].[Users_GetIdByEmail]";

			int userId = 0;

			_dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
			{
				paramCollection.AddWithValue("@Email", email);
			}, delegate (IDataReader reader, short set)
			{
				int index = 0;
				userId = reader.GetSafeInt32(index++);
			});

			return userId;
		}

		public int GetUserIdByToken(string token)
		{
			string procName = "[dbo].[UserTokens_SelectUserIdByToken]";

			int userId = 0;

			_dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
			{
				paramCollection.AddWithValue("@Token", token);
			}, delegate (IDataReader reader, short set)
			{
				int index = 0;
				userId = reader.GetSafeInt32(index++);
			});

			return userId;
		}

		public User GetById(int id)
		{
			string procName = "[dbo].[Users_Select_ById_WithRoles]";

			User user = null;

			_dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
			{
				parameterCollection.AddWithValue("@Id", id);
			}, delegate (IDataReader reader, short set)
			{
				int index = 0;
				user = MapUser(reader, ref index);

			});
			return user;
		}

		public UserAuth Login(UserLoginRequest model)
		{
			UserAuth currentUser = null;
			bool passwordsMatch = false;

			currentUser = this.GetByEmail(model.Email);

			if (currentUser != null)
			{
				passwordsMatch = BCryptHelper.CheckPassword(model.Password, currentUser.Password);
			}

			if (passwordsMatch == false)
			{
				currentUser = null;
			}

			return currentUser;
		}
		
		public void VerifyToken(string token)
		{
			string procName = "[dbo].[UserTokens_VerifyToken]";
			_dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
			{
				col.AddWithValue("@Token", token);

			}, returnParameters: null);
		}

		public bool VerifyTokenResetPassword(string token, string password)
		{
			bool response = false;

			string salt = BCrypt.BCryptHelper.GenerateSalt();
			string hashedPassword = BCrypt.BCryptHelper.HashPassword(password, salt);

			string procName = "[dbo].[UserTokens_VerifyTokenResetPassword]";
			_dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
			{
				col.AddWithValue("@Token", token);
				col.AddWithValue("@Password", hashedPassword);

				SqlParameter boolOut = new SqlParameter("@bit", SqlDbType.Bit);
				boolOut.Direction = ParameterDirection.Output;

				col.Add(boolOut);
			},
			returnParameters: delegate (SqlParameterCollection returnCollection)
			{
				object oBool = returnCollection["@bit"].Value;

				Boolean.TryParse(oBool.ToString(), out response);
			});

			return response;
		}

		public void UpdateStatus(UserUpdateStatusRequest model)
		{
			string procName = "[dbo].[Users_Update_Status]";
			_dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
			{
				col.AddWithValue("@Id", model.Id);
				col.AddWithValue("@UserStatusId", model.UserStatusId);
			},
			returnParameters: null);
		}

		public void UpdateUser(UserUpdateRequest model)
		{
			string procName = "[dbo].[Users_UpdateProfileSettings]";
			_dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
			{
				col.AddWithValue("@FirstName", model.FirstName);
				col.AddWithValue("@LastName", model.LastName);
				col.AddWithValue("@Mi", model.Mi);
				col.AddWithValue("@Yob", model.Yob);
				col.AddWithValue("@AvatarUrl", model.AvatarUrl);
				col.AddWithValue("@Id", model.Id);
			},
			returnParameters: null);
		}

		public void UpdatePassword(int id, string password, string confirmPassword)
		{
			string salt = BCrypt.BCryptHelper.GenerateSalt();
			string hashedPassword = BCrypt.BCryptHelper.HashPassword(password, salt);

			string procName = "[dbo].[Users_Update_Password]";
			_dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
			{
				col.AddWithValue("@Id", id);
				col.AddWithValue("@Password", hashedPassword);
			},
			returnParameters: null);
		}

		public UserDetail MapUserDetail(IDataReader reader, ref int startingIndex)
		{
			UserDetail user = new UserDetail();

			user.Id = reader.GetSafeInt32(startingIndex++);
			user.FirstName = reader.GetSafeString(startingIndex++);
			user.LastName = reader.GetSafeString(startingIndex++);
			user.Mi = reader.GetSafeString(startingIndex++);
			user.Email = reader.GetSafeString(startingIndex++);
			user.AvatarUrl = reader.GetString(startingIndex++);

			return user;
		}

		private static User MapUser(IDataReader reader, ref int startingIndex)
		{
			User user = new User();

			user.Id = reader.GetSafeInt32(startingIndex++);
			user.FirstName = reader.GetSafeString(startingIndex++);
			user.LastName = reader.GetSafeString(startingIndex++);
			user.Mi = reader.GetSafeString(startingIndex++);
			user.Email = reader.GetSafeString(startingIndex++);
			user.YOB = reader.GetSafeInt32(startingIndex++);
			user.AvatarUrl = reader.GetSafeString(startingIndex++);
			user.IsConfirmed = reader.GetSafeBool(startingIndex++);
			user.UserStatus = new LookUp();
			user.UserStatus.Id = reader.GetSafeInt32(startingIndex++);
			user.UserStatus.Name = reader.GetSafeString(startingIndex++);
			user.DateCreated = reader.GetSafeDateTime(startingIndex++);
			user.DateModified = reader.GetSafeDateTime(startingIndex++);
			string rolesString = reader.GetSafeString(startingIndex++);
			if (!string.IsNullOrEmpty(rolesString))
			{
				user.Roles = Newtonsoft.Json.JsonConvert.DeserializeObject<List<LookUp>>(rolesString);
			}

			return user;
		}

		private static UserAuth MapUserAuth(IDataReader reader, ref int startingIndex)
		{
			UserAuth user = new UserAuth();

			user.Id = reader.GetSafeInt32(startingIndex++);
			user.Email = reader.GetSafeString(startingIndex++);
			user.Password = reader.GetSafeString(startingIndex++);
			string rolesString = reader.GetSafeString(startingIndex++);
			if (!string.IsNullOrEmpty(rolesString))
			{
				user.Roles = Newtonsoft.Json.JsonConvert.DeserializeObject<List<LookUp>>(rolesString);
			}

			return user;
		}

		private static void MapUserParamCol(UserAddRequest model, SqlParameterCollection col)
		{
			col.AddWithValue("@FirstName", model.FirstName);
			col.AddWithValue("@LastName", model.LastName);
			col.AddWithValue("@Mi", model.Mi);
			col.AddWithValue("@Email", model.Email);
			col.AddWithValue("@YOB", model.YOB);
			col.AddWithValue("@AvatarUrl", model.AvatarUrl);
		}

		public async Task<bool> LogInAsync(string email, string password)
		{
			bool isSuccessful = false;

			IUserAuthData response = Get(email, password);

			if (response != null)
			{
				await _authenticationService.LogInAsync(response);
				isSuccessful = true;
			}

			return isSuccessful;
		}

		public async Task<bool> LogInTest(string email, string password, int id, string[] roles = null)
		{
			bool isSuccessful = false;
			var testRoles = new[] { "User", "Super", "Content Manager" };

			var allRoles = roles == null ? testRoles : testRoles.Concat(roles);

			IUserAuthData response = new UserBase
			{
				Id = id
				,
				Name = email
				,
				Roles = allRoles
				,
				TenantId = "Acme Corp UId"
			};

			Claim fullName = new Claim("CustomClaim", "Sabio Bootcamp");
			await _authenticationService.LogInAsync(response, new Claim[] { fullName });

			return isSuccessful;
		}

		public int Create(object userModel)
		{
			//make sure the password column can hold long enough string. put it to 100 to be safe

			int userId = 0;
			string password = "Get from user model when you have a concreate class";
			string salt = BCrypt.BCryptHelper.GenerateSalt();
			string hashedPassword = BCrypt.BCryptHelper.HashPassword(password, salt);

			//DB provider call to create user and get us a user id

			//be sure to store both salt and passwordHash
			//DO NOT STORE the original password value that the user passed us

			return userId;
		}

		/// <summary>
		/// Gets the Data call to get a give user
		/// </summary>
		/// <param name="email"></param>
		/// <param name="passwordHash"></param>
		/// <returns></returns>
		private IUserAuthData Get(string email, string password)
		{
			//make sure the password column can hold long enough string. put it to 100 to be safe
			string passwordFromDb = "";
			UserBase user = null;

			//get user object from db;

			bool isValidCredentials = BCrypt.BCryptHelper.CheckPassword(password, passwordFromDb);

			return user;
		}
	}
}