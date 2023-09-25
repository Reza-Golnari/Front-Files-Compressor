import os 
from rest_framework.generics import GenericAPIView
from .serializers import MySerializer
from minify_html import minify
from django.http import HttpResponse


class Compress(GenericAPIView):
    serializer_class = MySerializer

    def post(self, request):
        serializer = MySerializer(data=request.data)
        if serializer.is_valid():
            data_file = serializer.validated_data.get('data_file')
            data_str = data_file.read().decode('utf-8')
            compressed_data_str = minify(
                code=data_str,
                do_not_minify_doctype=False,
                keep_html_and_head_opening_tags=True,
                minify_js=True,
                minify_css=True,
                keep_closing_tags=True
            )

            name, extension = os.path.splitext(data_file.name)
            output_name = name + '(cmp)' + extension
            response = HttpResponse(
                compressed_data_str, content_type='application/octet-st ream')
            response['Content-Disposition'] = f'attachment; filename="{output_name}"'
            return response

        else:
            raise Exception(serializer.errors)
