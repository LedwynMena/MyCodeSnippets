	public class UserService : IUserService, IUserDetailMapper
	{
		private IAuthenticationService<int> _authenticationService;
		private IDataProvider _dataProvider;

		public UserService(IAuthenticationService<int> authSerice, IDataProvider dataProvider)
		{
			_authenticationService = authSerice;
			_dataProvider = dataProvider;
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
	}
