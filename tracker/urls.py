from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, ExpenseViewSet, CategoryViewSet, BudgetViewSet
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from .views import summary_view
from .views import budget_summary

router = DefaultRouter()
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'budgets', BudgetViewSet, basename='budget')

urlpatterns = [
    path('', lambda request: JsonResponse({'message': 'Budget Tracker API is running'})),
    # path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('api/', include(router.urls)),  # 👈 API routes for Expense, Category, Budget
    path('api/summary/', summary_view, name='summary'),
    path('budget-summary/', budget_summary, name='budget-summary'), 

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
